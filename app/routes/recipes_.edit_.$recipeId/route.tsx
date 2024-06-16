import { ActionFunction, LoaderFunction, json, redirect } from '@vercel/remix';
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { checkRole } from '~/utils/checkRole.server';
import { getRecipeWithDescription, updateRecipe } from '../../../db/operations';
import { HandledError, UnhandledError } from '~/components/errors';
import {
  useRecipeForm,
  RecipeForm,
  createResolver,
  RecipeEditFormData,
} from '~/components/forms/recipeForm';
import { getValidatedFormData } from 'remix-hook-form';

export const loader: LoaderFunction = async (args) => {
  const isAuthorized = checkRole(args, ['admin', 'family']);
  if (!isAuthorized) {
    return redirect('/recipes');
  }

  const { params } = args;
  const pageId = Number(params.recipeId);

  if (Number.isNaN(pageId)) {
    throw json(
      { message: 'The recipe you are looking for does not exist.' },
      { status: 404 },
    );
  }

  const recipe = await getRecipeWithDescription(pageId);
  if (!recipe) {
    throw json(
      { message: 'The recipe you are looking for does not exist.' },
      { status: 404 },
    );
  }

  // TODO: author should probably not be required since it isn't in the db schema
  // I should update the db operation to not require it and then update this code
  const { author, ingredients: recipeIngredients, ...recipeData } = recipe;
  return json({
    recipe: { ...recipeData, recipeIngredients, author: author?.name },
  });
};

export const action: ActionFunction = async (args) => {
  const { params, request } = args;

  const isAuthorized = checkRole(args, ['admin', 'family']);
  if (!isAuthorized) {
    return;
  }

  const { valid, result } = await parseRecipeId(params.recipeId);

  if (!valid) {
    throw result;
  }

  const resolver = createResolver('edit');

  const {
    errors,
    data,
    receivedValues: defaultValues,
  } = await getValidatedFormData<RecipeEditFormData>(request, resolver);

  if (errors) {
    console.error('there were validation errors!');
    return json({ errors, defaultValues });
  }

  await updateRecipe({ ...data, id: result });

  return redirect(`/recipes/${result}`);
};

const RecipeEdit = () => {
  const { recipe } = useLoaderData<typeof loader>();
  console.log(`recipe: ${JSON.stringify(recipe)}`);
  const recipeFormProps = useRecipeForm(recipe, 'edit');
  return <RecipeForm {...recipeFormProps} mode='edit' />;
};

export default RecipeEdit;

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

type ParsedIdReturnType = Promise<
  | {
      valid: false;
      result: ReturnType<typeof json>;
    }
  | { valid: true; result: number }
>;

const parseRecipeId = async (
  recipeId: string | undefined,
): ParsedIdReturnType => {
  const numericId = Number(recipeId);
  if (Number.isNaN(numericId)) {
    return {
      valid: false,
      result: json(
        { message: 'The recipe you are looking for does not exist' },
        { status: 404 },
      ),
    };
  }

  const recipe = await getRecipeWithDescription(numericId);
  if (!recipe) {
    return {
      valid: false,
      result: json(
        { message: 'The recipe you are looking for does not exist' },
        { status: 404 },
      ),
    };
  }

  return { valid: true, result: numericId };
};
