import { SignIn } from '@clerk/remix';

const SignInPage = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <SignIn />
    </div>
  );
};

export default SignInPage;
