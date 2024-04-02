import { LinksFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import stylesheet from '~/tailwind.css?url';
import { SiteHeader, SiteHeaderLink } from '~/components/layout/siteHeader';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesheet }];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <>
      <SiteHeader>
        <SiteHeaderLink to='/recipes'>Recipes</SiteHeaderLink>
        <SiteHeaderLink to='/about'>About</SiteHeaderLink>
        <SiteHeaderLink to='/permissionsTest'>temporary</SiteHeaderLink>
      </SiteHeader>
      <main className='mt-2'>
        <Outlet />
      </main>
    </>
  );
}
