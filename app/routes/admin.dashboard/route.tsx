import { getAuth } from '@clerk/remix/ssr.server';
import { LoaderFunction, redirect } from '@vercel/remix';

export const loader: LoaderFunction = async (args) => {
  const { sessionClaims } = await getAuth(args);
  if (sessionClaims?.metadata.role !== 'admin') {
    return redirect('/');
  }
};

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
};

export default AdminDashboard;
