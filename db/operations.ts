import { db } from './db';
import { recipes, ingredients, users } from './schema';

interface CreateRecipeArgs {
  name: string;
  instructions: string;
  createdBy: number;
  author?: string;
  recipeIngredients?: {
    name: string;
    amount?: number;
    unit?: string;
  }[];
}
// Abstracted to its own function because a recipe is
// split into two tables
export const createRecipe = async ({
  recipeIngredients,
  createdBy,
  ...recipeItems
}: CreateRecipeArgs) => {
  await db.transaction(async (trx) => {
    const result = await trx
      .insert(recipes)
      .values({
        ...recipeItems,
        userId: createdBy,
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
      }))
    );
  });
};

/**
 * @returns the userId of the created user
 */
export const createUser = async (userInfo: { name: string; email: string }) => {
  const result = await db
    .insert(users)
    .values(userInfo)
    .returning({ userId: users.id });
  return result[0].userId;
};
