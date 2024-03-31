import { Link } from '@remix-run/react';
import { FC } from 'react';

interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  author?: string;
  href?: string;
}

export const Card: FC<CardProps> = (props: CardProps) => {
  return (
    <li className='flex flex-col bg-gray-50 rounded-lg shadow-md hover:cursor-pointer p-4'>
      {props.imageUrl && (
        <img
          src={props.imageUrl}
          alt={props.title}
          className='w-full h-48 object-cover object-center rounded-lg'
        />
      )}
      <div className='p-6'>
        {props.href ? (
          <Link to={props.href}>
            <h2 className='text-xl font-semibold'>{props.title}</h2>
          </Link>
        ) : (
          <h2 className='text-xl font-semibold'>{props.title}</h2>
        )}
        {props.author && (
          <p className='text-gray-700 text-sm'>By {props.author}</p>
        )}
        <p className='text-gray-600'>{props.description}</p>
        {props.href && (
          <a href={props.href} className='text-blue-500 hover:underline mt-2'>
            Read More
          </a>
        )}
      </div>
    </li>
  );
};
