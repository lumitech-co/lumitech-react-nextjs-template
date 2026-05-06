import { Suspense } from 'react';

import { HomeView } from 'app/views/home-view';

const HomePage = () => (
  <Suspense fallback={null}>
    <HomeView />
  </Suspense>
);

export default HomePage;
