import { useLoaderData } from '@remix-run/react';
import { Card } from '~/components/card';

export const loader = () => {
  return {
    recipes: [
      {
        id: 1,
        name: 'Grits',
        author: 'grandmother_bot',
        description: "Grandmother bot's take on a southern classic",
      },
      {
        id: 2,
        name: 'Grits',
        author: 'grandmother_bot',
        description: "Grandmother bot's take on a southern classic",
      },
      {
        id: 3,
        name: 'Grits',
        author: 'grandmother_bot',
        description: "Grandmother bot's take on a southern classic",
      },
      {
        id: 4,
        name: 'Grits',
        author: 'grandmother_bot',
        description: "Grandmother bot's take on a southern classic",
      },
      {
        id: 5,
        name: 'Grits',
        author: 'grandmother_bot',
        description: "Grandmother bot's take on a southern classic",
      },
      {
        id: 6,
        name: 'Grits',
        author: 'grandmother_bot',
        description: "Grandmother bot's take on a southern classic",
      },
    ],
  };
};

const Recipes = () => {
  const { recipes } = useLoaderData<typeof loader>();

  if (!recipes || recipes.length === 0) {
    <p className='text-center'>There are no recipes to load yet</p>;
  }

  return (
    <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-5 justify-items-center'>
      {recipes?.map((recipe) => (
        <Card
          key={recipe.id}
          title={recipe.name}
          description={recipe.description}
          imageUrl='https://upload.wikimedia.org/wikipedia/commons/4/49/Grits_with_cheese%2C_bacon%2C_green_onion_and_poached_egg.jpg'
          author={recipe.author}
        />
      ))}
    </ul>
  );
};

export default Recipes;
