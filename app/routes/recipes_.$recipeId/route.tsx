import { json } from '@vercel/remix';
import { LoaderFunction } from '@remix-run/node';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { getRecipe } from '../../../db/operations';
import { HandledError, UnhandledError } from '~/components/errors';
import { DEFAULT_IMAGE_URL } from '~/utils/consts';

export const loader: LoaderFunction = async ({ params }) => {
  // the url param here is just a number which is a recipe id
  const pageId = Number(params.recipeId);
  if (Number.isNaN(pageId)) {
    throw json(
      { message: 'The recipe you are looking for does not exist.' },
      { status: 404 },
    );
  }

  const recipe = await getRecipe(pageId);
  if (!recipe) {
    throw json(
      { message: 'The recipe you are looking for does not exist.' },
      { status: 404 },
    );
  }

  return json({ recipe }, { headers: { 'Cache-Control': 'max-age=120' } });
};

const Recipe = () => {
  const { recipe } = useLoaderData<typeof loader>();
  console.log(recipe);
  return (
    <div>
      <h1>{recipe.name}</h1>
      <img src={recipe.imageUrl ?? DEFAULT_IMAGE_URL} alt={recipe.name} />
      <h2>Author: {recipe.author.name}</h2>
      <p>{recipe.instructions}</p>
      <ul>
        {recipe.ingredients.map((ingredient: typeof recipe.ingredient) => (
          <li key={ingredient.id}>
            {ingredient.amount} {ingredient.unit} - {ingredient.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ErrorBoundary = () => {
  const error = useRouteError();
  return (
    <div className='p4'>
      {isRouteErrorResponse(error) ? (
        <HandledError error={error} />
      ) : (
        <UnhandledError error={error} />
      )}
    </div>
  );
};

export default Recipe;
