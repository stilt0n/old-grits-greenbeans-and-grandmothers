import { Link, useNavigate } from '@remix-run/react';
import { FC } from 'react';
import { DEFAULT_IMAGE_URL } from '~/utils/consts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

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
  const navigate = useNavigate();
  return (
    <Card
      className='hover:shadow-md hover:cursor-pointer'
      onClick={() => navigate(`/recipes/${id}`)}
    >
      <CardHeader>
        <CardTitle>
          <Link to={`/recipes/${id}`}>{title}</Link>
        </CardTitle>
        <CardDescription>{author}</CardDescription>
        <CardContent className='px-0 mx-[-1.5rem]'>
          <img
            src={imageUrl}
            alt={title}
            className='w-full h-64 md:h-56 object-cover'
          />
        </CardContent>
        <CardFooter>{description}</CardFooter>
      </CardHeader>
    </Card>
  );
};
