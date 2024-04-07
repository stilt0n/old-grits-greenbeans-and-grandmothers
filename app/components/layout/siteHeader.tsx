import type { FC, PropsWithChildren } from 'react';
import { CircleUser } from 'lucide-react';
import clsx from 'clsx';
import { NavLink } from '@remix-run/react';

export const SiteHeader: FC<PropsWithChildren> = (props) => {
  return (
    <header className='h-14 bg-site-blue-basic shadow-md flex pt-4 px-2'>
      <div className='flex flex-row w-full justify-between'>
        <NavLink to='/'>
          <h1 className='md:text-2xl font-site-logo ml-2'>
            Grits, Greenbeans and Grandmothers
          </h1>
        </NavLink>
        <nav className='align-self-right mr-2'>
          <ul className='flex flex-row justify-between'>
            {props.children}
            <SiteHeaderLink to='/sign-in' className='pl-2 md:pl-8'>
              <CircleUser className='w-8 h-8' />
            </SiteHeaderLink>
          </ul>
        </nav>
      </div>
    </header>
  );
};

interface SiteHeaderLinkProps extends PropsWithChildren {
  to: string;
  className?: string;
}

export const SiteHeaderLink: FC<SiteHeaderLinkProps> = (props) => {
  return (
    <li className={clsx({ 'w-16': !props.className }, props.className)}>
      <NavLink to={props.to}>
        {({ isActive }) => (
          <div
            className={clsx('text-center hover:bg-site-blue-bold', {
              'bg-site-blue-bold': isActive,
            })}
          >
            {props.children}
          </div>
        )}
      </NavLink>
    </li>
  );
};
