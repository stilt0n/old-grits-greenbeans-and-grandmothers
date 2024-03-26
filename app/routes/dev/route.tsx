import { Menu, CircleUser, Search } from 'lucide-react';

const Dev = () => {
  return (
    <div className='h-screen w-screen'>
      <header className='h-14 bg-slate-200 shadow-md flex pt-4 px-2'>
        <div className='flex flex-row w-full justify-between'>
          <Menu />
          <h1 className='justify-self-center text-xl'>
            Grits, Greenbeans and Grandmothers
          </h1>
          <span className='flex flex-row gap-1'>
            <Search />
            <CircleUser />
          </span>
        </div>
      </header>
      <body>
        <h1 className='text-center mt-4'>
          This route is for easily prototyping layouts
        </h1>
      </body>
    </div>
  );
};

export default Dev;
