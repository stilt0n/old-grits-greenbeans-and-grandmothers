import { ActionFunction, LoaderFunction, redirect, json } from '@vercel/remix';
import { getValidatedFormData } from 'remix-hook-form';
import { checkRole } from '~/utils/checkRole.server';
import {
  useRecipeForm,
  RecipeForm,
  resolver,
  RecipeFormData,
} from '~/components/forms/recipeForm';
import { createRecipeInferAuthor } from '../../../db/operations';
import { HandledError, UnhandledError } from '~/components/errors';
import { isRouteErrorResponse, useRouteError } from '@remix-run/react';

export const loader: LoaderFunction = async (args) => {
  const isAuthorized = checkRole(args, ['admin', 'family']);
  if (!isAuthorized) {
    return redirect('/recipes');
  }
  return null;
};

export const action: ActionFunction = async (args) => {
  const isAuthorized = checkRole(args, ['admin', 'family']);
  if (!isAuthorized) {
    return;
  }

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<RecipeFormData>(args.request, resolver);
  if (errors) {
    console.error('there were validation errors!');
    return json({ errors, defaultValues });
  }

  const newId = await createRecipeInferAuthor(data);

  if (newId === undefined) {
    throw new Response(
      'The server had an unexpected error when trying to insert data into the database',
      { status: 500 },
    );
  }

  return redirect(`/recipes/${newId}`);
};

const CreateRecipe = () => {
  const recipeFormProps = useRecipeForm({
    name: '',
    description: '',
    instructions: '',
    author: '',
    recipeIngredients: [{ name: '', amount: undefined, unit: '' }],
  });

  return <RecipeForm mode='create' {...recipeFormProps} />;
};

export default CreateRecipe;

export const ErrorBoundary = () => {
  const error = useRouteError();
  return (
    <div className='p4'>
      {isRouteErrorResponse(error) ? (
        <HandledError error={error} reroute='/create-recipe' />
      ) : (
        <UnhandledError error={error} />
      )}
    </div>
  );
};
