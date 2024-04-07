import { useLoaderData } from '@remix-run/react';
import { getRecipeList } from '../../../db/operations';
import { RecipeGrid } from './recipeGrid';

export const loader = async () => {
  const recipes = await getRecipeList();
  return recipes;
};

const Recipes = () => {
  const recipes = useLoaderData<typeof loader>();

  if (!recipes || recipes.length === 0) {
    <p className='text-center'>There are no recipes to load yet</p>;
  }

  return (
    <div className='p-4 md:p-8'>
      <RecipeGrid recipes={recipes} />
    </div>
  );
};

export default Recipes;
