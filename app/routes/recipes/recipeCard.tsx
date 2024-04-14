/**
 * This is to replace ~/components/card.tsx
 *
 * The copilot generated layout for the card component was okay but I think it can be much better.
 * Since I only expect to use cards in the recipes route I think it doesn't make sense to make this
 * component composable in the same way I did for the siteHeader component.
 */

import { Link } from '@remix-run/react';
import { FC } from 'react';
import { DEFAULT_IMAGE_URL } from '~/utils/consts';

interface RecipeCardProps {
  title: string;
  description: string;
  id: number;
  imageUrl?: string;
  author?: string;
}

export const RecipeCard: FC<RecipeCardProps> = ({
  title,
  description,
  id,
  imageUrl = DEFAULT_IMAGE_URL,
  author = 'Unknown author',
}) => {
  return (
    <li className='rounded-lg bg-white shadow-md hover:shadow-lg overflow-hidden'>
      <Link to={`/recipes/${id}`} className='m-2'>
        <h1 className='font-bold text-center font-2xl'>{title}</h1>
      </Link>
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
