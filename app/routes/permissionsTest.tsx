import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/remix';
import { getAuth } from '@clerk/remix/ssr.server';
import { useLoaderData } from '@remix-run/react';
import { LoaderFunction, redirect } from '@vercel/remix';

export const loader: LoaderFunction = async (args) => {
  const { userId, sessionClaims } = await getAuth(args);
  if (!userId) {
    return redirect('/sign-in');
  }

  return { role: sessionClaims?.metadata.role };
};

const PermissionsTest = () => {
  const { role } = useLoaderData<typeof loader>();
  return (
    <div>
      <SignedIn>
        <h1>This page should only be viewable to users who are signed in</h1>
        <h2>your role: {role}</h2>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
};

export default PermissionsTest;
