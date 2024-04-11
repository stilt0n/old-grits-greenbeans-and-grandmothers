import { LinksFunction, LoaderFunction } from '@vercel/remix';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import { rootAuthLoader } from '@clerk/remix/ssr.server';
import { ClerkApp, SignedIn } from '@clerk/remix';
import { HandledError, UnhandledError } from '~/components/errors';
import { SiteHeader, SiteHeaderLink } from '~/components/layout/siteHeader';
import stylesheet from '~/tailwind.css?url';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesheet }];
};

export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body className='bg-gray-100'>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const App = () => {
  return (
    <>
      <SiteHeader>
        <SiteHeaderLink to='/recipes'>Recipes</SiteHeaderLink>
        <SiteHeaderLink to='/about'>About</SiteHeaderLink>
        <SignedIn>
          <SiteHeaderLink to='/permissionsTest'>temporary</SiteHeaderLink>
        </SignedIn>
      </SiteHeader>
      <main className='mt-2 px-6'>
        <Outlet />
      </main>
    </>
  );
};

export const ErrorBoundary = () => {
  const error = useRouteError();
  return (
    <div className='p4'>
      {isRouteErrorResponse(error) ? (
        <HandledError error={error} />
      ) : (
        <UnhandledError error={error} />
      )}
    </div>
  );
};

export default ClerkApp(App);
