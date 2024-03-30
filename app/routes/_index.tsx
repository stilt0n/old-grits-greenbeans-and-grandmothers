import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Grits, Greenbeans and Grandmothers' },
    { name: 'description', content: 'An online family cookbook' },
  ];
};

export default function Index() {
  return (
    <div>
      <h1 className='text-center'>Home Page</h1>
    </div>
  );
}
