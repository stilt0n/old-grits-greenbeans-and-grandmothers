import { UserRole } from '~/types/globals';
import { getAuth } from '@clerk/remix/ssr.server';
import { LoaderFunctionArgs } from '@vercel/remix';

export const checkRole = async (
  loaderFunctionArgs: LoaderFunctionArgs,
  validRoles: UserRole[],
) => {
  const { sessionClaims } = await getAuth(loaderFunctionArgs);
  return (
    sessionClaims?.metadata.role &&
    validRoles.includes(sessionClaims.metadata.role)
  );
};
