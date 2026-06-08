import MinimalLayout from 'layout/MinimalLayout';

import { LandingPage } from 'views/workhive/landing';

const LandingRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [{ index: true, element: <LandingPage /> }]
};

export default LandingRoutes;
