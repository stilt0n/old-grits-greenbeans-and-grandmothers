import { ActionFunction, LoaderFunction, redirect } from '@vercel/remix';
import { checkRole } from '~/utils/checkRole.server';
import { useRecipeForm, RecipeForm } from '~/components/forms/recipeForm';

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
  return null;
};

const CreateRecipe = () => {
  const recipeFormProps = useRecipeForm({
    name: '',
    description: '',
    instructions: '',
    author: '',
    ingredients: [{ name: '', amount: '', unit: '' }],
  });

  return <RecipeForm {...recipeFormProps} />;
};

export default CreateRecipe;
