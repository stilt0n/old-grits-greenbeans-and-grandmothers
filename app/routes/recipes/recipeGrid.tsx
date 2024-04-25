import { FC } from 'react';
import { RecipeCard } from '~/components/recipeCard';

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

// The recipe grid will eventually be a feed and should then implement this spec:
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/feed_role
export const RecipeGrid: FC<RecipeGridProps> = ({ recipes }) => {
  return (
    <ul className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
      {recipes?.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          title={recipe.name}
          description={recipe.description}
          id={recipe.id}
          author={recipe.author ?? undefined}
        />
      ))}
    </ul>
  );
};
