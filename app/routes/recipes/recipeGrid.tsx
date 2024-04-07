import { FC } from 'react';
import { RecipeCard } from './recipeCard';

interface RecipeData {
  name: string;
  imageUrl: string | null;
  author: string | null;
  authorId: number | null;
  description: string;
  id: number;
}

interface RecipeGridProps {
  recipes: RecipeData[];
}

export const RecipeGrid: FC<RecipeGridProps> = ({ recipes }) => {
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
