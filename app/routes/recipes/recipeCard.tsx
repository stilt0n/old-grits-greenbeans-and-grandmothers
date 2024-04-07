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
    <li className='w-3/4 shadow-sm rounded-md py-3 bg-site-blue-dark'>
      <div className='mb-2'>
        <h1 className='text-2xl text-center font-site-heading font-bold'>
          {title}
        </h1>
        <p className='text-l text-center font-site-text italic text-gray-700'>
          {author}
        </p>
      </div>
      <img src={imageUrl} alt={title} className='w-full' />
      <div className='mt-3'>
        <p className='text-m font-site-text text-center'>{description}</p>
      </div>
    </li>
  );
};
