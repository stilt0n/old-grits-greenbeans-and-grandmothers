import { Form } from '@remix-run/react';
import { FC, useId } from 'react';
import { useFieldArray } from 'react-hook-form';
import { useRemixForm } from 'remix-hook-form';
import { FormInput } from './formInput';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const useRecipeForm = (defaultValues: RecipeFormData) => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    control,
  } = useRemixForm<RecipeFormData>({
    mode: 'onSubmit',
    resolver,
    defaultValues,
    submitHandlers: {
      onValid: (data) => console.log(data),
      onInvalid: (data) => console.log(`invalid input!\n${data}`),
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: 'ingredients',
    control,
  });

  return { handleSubmit, errors, register, fields, append, remove };
};

interface RecipeFormProps extends ReturnType<typeof useRecipeForm> {}

export const RecipeForm: FC<RecipeFormProps> = ({
  handleSubmit,
  errors,
  register,
  fields,
  append,
  remove,
}) => {
  const textareaId = useId();
  return (
    <Form onSubmit={handleSubmit} className='h-full flex flex-col gap-y-4 p-4'>
      <FormInput
        label='Recipe name'
        type='text'
        errorMessage={errors?.name?.message}
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
            <FormInput
              className='col-span-2'
              label='Ingredient name'
              type='text'
              errorMessage={errors?.ingredients?.[index]?.name?.message}
              required
              {...register(`ingredients.${index}.name`)}
            />
            <FormInput
              className='col-span-2'
              label='Ingredient amount'
              type='text'
              errorMessage={errors?.ingredients?.[index]?.amount?.message}
              {...register(`ingredients.${index}.amount`)}
            />
            <FormInput
              className='col-span-2'
              label='Ingredient unit'
              type='text'
              errorMessage={errors?.ingredients?.[index]?.unit?.message}
              {...register(`ingredients.${index}.unit`)}
            />
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
        onClick={() => append({ name: 'New Ingredient', amount: '', unit: '' })}
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

const ingredientSchema = z.object({
  name: z.string().min(1, 'ingredient name cannot be blank'),
  amount: z.string().optional(),
  unit: z.string().optional(),
});

const recipeSchema = z.object({
  name: z.string().min(1, 'recipe name cannot be blank'),
  description: z
    .string()
    .max(255, 'recipe description should be less than 255 characters')
    .optional(),
  author: z.string().optional(),
  ingredients: z.array(ingredientSchema),
  instructions: z.string().min(1, 'recipe instructions cannot be blank'),
});

const resolver = zodResolver(recipeSchema);

type RecipeFormData = z.infer<typeof recipeSchema>;
