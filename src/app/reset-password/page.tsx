import { Suspense } from 'react';

import { ResetPasswordView } from './reset-password';

const ResetPasswordPage = () => (
  <Suspense fallback={null}>
    <ResetPasswordView />
  </Suspense>
);

export default ResetPasswordPage;
