import { desc, eq, asc } from 'drizzle-orm';
import { db } from './db';
import { recipes, ingredients, authors } from './schema';
import { partition } from '~/utils/helpers';

interface SharedCreateRecipeArgs {
  name: string;
  instructions: string;
  description: string;
  recipeIngredients?: {
    name: string;
    amount?: number;
    unit?: string;
  }[];
}

interface CreateRecipeWithNewAuthorArgs extends SharedCreateRecipeArgs {
  author: {
    name: string;
    bio?: string;
  };
}
interface CreateRecipeWithExistingAuthorArgs extends SharedCreateRecipeArgs {
  authorId?: number;
}

type CreateRecipeArgs =
  | (CreateRecipeWithNewAuthorArgs & { createAuthor: true })
  | (CreateRecipeWithExistingAuthorArgs & { createAuthor?: false });

export const createRecipe = async ({
  recipeIngredients,
  ...recipeItems
}: CreateRecipeArgs) => {
  return await db.transaction(async (trx) => {
    let authorId;
    if (recipeItems.createAuthor) {
      authorId = await createAuthor(recipeItems.author);
    } else {
      authorId = recipeItems.authorId;
    }

    const result = await trx
      .insert(recipes)
      .values({
        name: recipeItems.name,
        instructions: recipeItems.instructions,
        description: recipeItems.description,
        authorId,
      })
      .returning({ recipeId: recipes.id, createdAt: recipes.createdAt });

    // each transaction should only insert a single recipe
    // we also should rollback the transaction if no insert
    // takes place
    if (result.length !== 1) {
      console.log('rolling back transaction...');
      console.log(`result of previous query:\n  ${result}`);
      await trx.rollback();
      return;
    }

    const { recipeId, createdAt } = result[0];
    if (recipeIngredients && recipeIngredients.length > 0) {
      const ingredientResult = await trx
        .insert(ingredients)
        .values(
          recipeIngredients.map((ingredient) => ({
            ...ingredient,
            recipeId,
            createdAt,
          })),
        )
        .returning({ ingredientId: ingredients.id });

      if (ingredientResult.length < 1) {
        console.log(
          `inserted ingredients but got an empty result:\n  ${result}`,
        );
        await trx.rollback();
        return;
      }
    }
    return recipeId;
  });
};

export const createRecipeInferAuthor = async ({
  author = 'Unknown author',
  ...args
}: Omit<CreateRecipeWithExistingAuthorArgs, 'authorId'> & {
  author?: string;
}) => {
  const result = await getAuthor(author);
  const authorId = result?.[0]?.id;
  if (authorId) {
    return await createRecipe({ ...args, authorId });
  }
  return await createRecipe({
    ...args,
    author: { name: author },
    createAuthor: true,
  });
};

export const getRecipeList = async () => {
  return await db
    .select({
      name: recipes.name,
      imageUrl: recipes.imageUrl,
      author: authors.name,
      authorId: authors.id,
      description: recipes.description,
      id: recipes.id,
    })
    .from(recipes)
    .leftJoin(authors, eq(recipes.authorId, authors.id))
    .orderBy(desc(recipes.createdAt));
};

/** *
 * @returns the id of the created author
 */
export const createAuthor = async (authorInfo: {
  name: string;
  bio?: string;
}) => {
  const result = await db
    .insert(authors)
    .values(authorInfo)
    .returning({ authorId: authors.id });
  return result[0].authorId;
};

export const resetTables = async () => {
  await db.delete(authors);
  await db.delete(ingredients);
  await db.delete(recipes);
};

export const getRecipe = async (recipeId: number) => {
  return await db.query.recipes.findFirst({
    columns: {
      name: true,
      imageUrl: true,
      instructions: true,
      authorId: true,
    },
    with: {
      ingredients: {
        columns: {
          name: true,
          amount: true,
          unit: true,
        },
      },
      author: {
        columns: {
          name: true,
        },
      },
    },
    where: eq(recipes.id, recipeId),
  });
};

/**
 * @param identifier | the author's name or the author's id
 */
export const getAuthor = async (identifier: string | number) => {
  return await db
    .select()
    .from(authors)
    .where(
      typeof identifier === 'string'
        ? eq(authors.name, identifier)
        : eq(authors.id, identifier),
    );
};

interface UpdateRecipeArgs {
  id: number;
  name: string;
  instructions: string;
  description: string;
  author: string;
  recipeIngredients?: {
    name: string;
    amount?: number;
    unit?: string;
    id?: number;
  }[];
}

interface IngredientFields {
  id?: number;
  name: string;
  amount?: number;
  unit?: string;
}

const ingredientEquals = (a: IngredientFields, b: IngredientFields) => {
  return (
    a.id === b.id &&
    a.name === b.name &&
    // uses == here because amount/unit can be undefined or null
    // but we want to treat these as the same thing
    a.amount == b.amount &&
    a.unit == b.unit
  );
};

export const updateRecipe = async ({
  recipeIngredients,
  author,
  id,
  ...recipeArgs
}: UpdateRecipeArgs) => {
  const result = await getAuthor(author);
  const shouldCreateAuthor = result.length === 0;
  return await db.transaction(async (trx) => {
    try {
      let authorId: number | undefined;
      if (shouldCreateAuthor) {
        [{ authorId }] = await trx
          .insert(authors)
          .values({ name: author })
          .returning({ authorId: authors.id });
      }

      const updatedFields = authorId ? { ...recipeArgs, authorId } : recipeArgs;
      trx.update(recipes).set(updatedFields).where(eq(recipes.id, id));

      if (recipeIngredients) {
        // diff ingredients to see if any changed
        const existingIngredients = await trx
          .select()
          .from(ingredients)
          .where(eq(ingredients.recipeId, id))
          .orderBy(asc(ingredients.id));

        const [newIngredients, modifiedIngredients] = partition(
          recipeIngredients,
          ({ id }) => id === undefined,
        );

        // check if any ingredients were modified so that we can
        // avoid unnecessary deletions when nothing has changed
        modifiedIngredients.sort((a, b) => a.id! - b.id!);

        const isUnchanged =
          existingIngredients.length === modifiedIngredients.length &&
          modifiedIngredients.every((ingredient, i) =>
            ingredientEquals(
              ingredient,
              existingIngredients[i] as IngredientFields,
            ),
          );

        // This is probably not the most efficient approach but it simplifies
        // things to just delete and remake all the ingredients when a change
        // is detected. This can be optimized later if necessary, or even
        // migrated to a document store like MongoDB which was realistically
        // the better fit for this type of data in the first place.
        if (!isUnchanged) {
          const insertIngredients = [
            ...newIngredients,
            ...modifiedIngredients,
          ].map(({ name, amount, unit }) => ({
            name,
            amount,
            unit,
            recipeId: id,
          }));
          trx.delete(ingredients).where(eq(ingredients.recipeId, id));
          trx.insert(ingredients).values(insertIngredients);
        } else {
          trx.insert(ingredients).values(
            newIngredients.map((ingredient) => ({
              ...ingredient,
              recipeId: id,
            })),
          );
        }
      } else {
        trx.delete(ingredients).where(eq(ingredients.recipeId, id));
      }
    } catch (err) {
      console.log(
        `Got an error trying to update recipe:\n${err instanceof Error ? err.message : String(err)}`,
      );
      trx.rollback();
    }
  });
};
