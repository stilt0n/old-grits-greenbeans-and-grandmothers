/**
 * This is to replace ~/components/card.tsx
 *
 * The copilot generated layout for the card component was okay but I think it can be much better.
 * Since I only expect to use cards in the recipes route I think it doesn't make sense to make this
 * component composable in the same way I did for the siteHeader component.
 */

import { FC } from 'react';

// TODO: Replace this with my own image. Should probably not use wikipedia images for the site.
const DEFAULT_IMAGE_URL =
  'https://upload.wikimedia.org/wikipedia/commons/4/49/Grits_with_cheese%2C_bacon%2C_green_onion_and_poached_egg.jpg';

interface RecipeCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  author?: string;
}

export const RecipeCard: FC<RecipeCardProps> = ({
  title,
  description,
  imageUrl = DEFAULT_IMAGE_URL,
  author = 'Unknown author',
}) => {
  return (
    <li className='rounded-lg bg-white shadow-md hover:shadow-lg overflow-hidden'>
      <div className='m-2'>
        <h1 className='font-bold text-center font-2xl'>{title}</h1>
      </div>
      <img
        src={imageUrl}
        alt={title}
        className='w-full h-64 md:h-56 object-cover'
      />
      <div className='m-4'>
        <p className='block text-slate-700'>{author}</p>
        <p className='text-m font-site-text'>{description}</p>
      </div>
    </li>
  );
};
