import { useLoaderData } from '@remix-run/react';
import { getRecipeList } from '../../../db/operations';
import { RecipeCard } from './recipeCard';

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
    <ul className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {recipes?.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          title={recipe.name}
          description={recipe.description}
          author={recipe.author ?? undefined}
        />
      ))}
    </ul>
  );
};

export default Recipes;
