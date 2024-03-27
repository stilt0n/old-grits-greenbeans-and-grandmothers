import { Form } from '@remix-run/react';
import { Menu, CircleUser, Search } from 'lucide-react';

const Dev = () => {
  return (
    <div className='h-screen w-screen'>
      <header className='h-24 bg-slate-200 shadow-md flex pt-4 px-2 md:h-28'>
        <div className='flex flex-col w-full'>
          <div className='flex flex-row w-full justify-between'>
            <Menu />
            <h1 className='justify-self-center md:text-2xl font-site-logo'>
              Grits, Greenbeans and Grandmothers
            </h1>
            <CircleUser />
          </div>
          <Form className='flex border-2 border-gray-300 bg-slate-50 rounded-md mt-2'>
            <button className='px-2 mr-1'>
              <Search className='h-4 w-4' />
            </button>
            <input
              type='text'
              className='w-full bg-slate-50 rounded-md outline-none p-2'
            />
          </Form>
        </div>
      </header>
      <body>
        <h1 className='text-center mt-4 font-site-heading'>
          This route is for easily prototyping layouts
        </h1>
      </body>
    </div>
  );
};

export default Dev;
