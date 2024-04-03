import { desc, eq } from 'drizzle-orm';
import { db } from './db';
import { recipes, ingredients, authors } from './schema';

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
  await db.transaction(async (trx) => {
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
      await trx.rollback();
      return;
    }

    if (!recipeIngredients || recipeIngredients.length === 0) {
      return;
    }

    const { recipeId, createdAt } = result[0];
    await trx.insert(ingredients).values(
      recipeIngredients.map((ingredient) => ({
        ...ingredient,
        recipeId,
        createdAt,
      })),
    );
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
