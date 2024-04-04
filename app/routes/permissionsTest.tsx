import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/remix';
import { getAuth } from '@clerk/remix/ssr.server';
import { LoaderFunction, redirect } from '@vercel/remix';

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return redirect('/sign-in');
  }
  return {};
};

const PermissionsTest = () => {
  return (
    <div>
      <SignedIn>
        <h1>This page should only be viewable to users with an admin role</h1>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </div>
  );
};

export default PermissionsTest;
