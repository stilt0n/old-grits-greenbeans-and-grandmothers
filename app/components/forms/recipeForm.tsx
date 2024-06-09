import { Form } from '@remix-run/react';
import { FC, useId } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useRemixForm } from 'remix-hook-form';
import { FormInput } from './formInput';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { zodResolver } from '@hookform/resolvers/zod';

export const useRecipeForm = (
  defaultValues: RecipeFormData,
  mode?: 'create' | 'edit',
) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
  } = useRemixForm<RecipeFormData>({
    mode: 'onSubmit',
    resolver: createResolver(mode ?? 'create'),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    name: 'recipeIngredients',
    control,
  });

  return { handleSubmit, errors, register, fields, append, remove, control };
};

interface RecipeFormProps extends ReturnType<typeof useRecipeForm> {
  mode: 'create' | 'edit';
}

export const RecipeForm: FC<RecipeFormProps> = ({
  handleSubmit,
  errors,
  register,
  fields,
  append,
  remove,
  control,
  mode,
}) => {
  const textareaId = useId();
  return (
    <Form onSubmit={handleSubmit} className='h-full flex flex-col gap-y-4 p-4'>
      <FormInput
        label='Recipe name'
        type='text'
        errorMessage={errors?.name?.message}
        disabled={mode === 'edit'}
        required
        {...register('name')}
      />
      <FormInput
        label='Recipe description (max 255 characters)'
        type='text'
        errorMessage={errors?.description?.message}
        {...register('description')}
      />
      <FormInput label='Author' type='text' {...register('author')} />
      <ul>
        {fields.map((ingredient, index) => (
          <li key={ingredient.id} className='grid grid-cols-7 gap-2 items-end'>
            <Controller
              render={({ field }) => (
                <FormInput
                  className='col-span-2'
                  label='Ingredient name'
                  type='text'
                  errorMessage={
                    errors?.recipeIngredients?.[index]?.name?.message
                  }
                  required
                  {...field}
                />
              )}
              name={`recipeIngredients.${index}.name`}
              control={control}
            />
            <Controller
              render={({ field }) => (
                <FormInput
                  className='col-span-2'
                  label='Ingredient amount'
                  type='number'
                  errorMessage={
                    errors?.recipeIngredients?.[index]?.amount?.message
                  }
                  {...field}
                />
              )}
              name={`recipeIngredients.${index}.amount`}
              control={control}
            />
            <Controller
              render={({ field }) => (
                <FormInput
                  className='col-span-2'
                  label='Ingredient unit'
                  type='text'
                  errorMessage={
                    errors?.recipeIngredients?.[index]?.unit?.message
                  }
                  {...field}
                />
              )}
              name={`recipeIngredients.${index}.unit`}
              control={control}
            />
            {mode === 'edit' && ingredient.id ? (
              <Controller
                render={({ field }) => <input type='hidden' {...field} />}
                name={`recipeIngredients.${index}.id`}
                control={control}
              />
            ) : null}
            <Button
              className='col-span-1'
              type='button'
              aria-label={`remove ${ingredient.name ?? 'empty ingredient'}`}
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>
      <Button
        type='button'
        aria-label='add ingredient'
        onClick={() =>
          append({ name: 'New Ingredient', amount: undefined, unit: '' })
        }
      >
        Add Ingredient
      </Button>
      <div>
        <Label htmlFor={textareaId}>Recipe Instructions</Label>
        <Textarea className='h-64' required {...register('instructions')} />
      </div>
      <Button type='submit'>Submit</Button>
    </Form>
  );
};

const ingredientSchema = zfd.formData({
  name: z.string().min(1, 'ingredient name cannot be blank'),
  amount: zfd.numeric(z.number().optional()),
  unit: z.string().optional(),
  // Used when updating a recipe since we will need to
  // either insert new ingredients or replace old ones
  id: zfd.numeric(z.number().optional()),
});

const recipeSchema = z.object({
  name: z.string().min(1, 'recipe name cannot be blank'),
  description: z
    .string()
    .min(1, 'recipe description cannot be blank')
    .max(255, 'recipe description should be less than 255 characters'),
  author: z.string().optional(),
  recipeIngredients: z.array(ingredientSchema),
  instructions: z.string().min(1, 'recipe instructions cannot be blank'),
});

const recipeEditSchema = z.object({
  name: z.string().min(1, 'recipe name cannot be blank'),
  description: z
    .string()
    .min(1, 'recipe description cannot be blank')
    .max(255, 'recipe description should be less than 255 characters'),
  author: z.string(),
  recipeIngredients: z.array(ingredientSchema),
  instructions: z.string().min(1, 'recipe instructions cannot be blank'),
});

export const createResolver = (mode: 'create' | 'edit') => {
  return zodResolver(mode === 'create' ? recipeSchema : recipeEditSchema);
};

export type RecipeFormData = z.infer<typeof recipeSchema>;
export type RecipeEditFormData = z.infer<typeof recipeEditSchema>;
