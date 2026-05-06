import { Suspense } from 'react';

import { SignInView } from './sign-in-view';

const SignInPage = () => (
  <Suspense fallback={null}>
    <SignInView />
  </Suspense>
);

export default SignInPage;
