import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// landing routing
const LandingPage = Loadable(lazy(() => import('views/workhive/landing/pages/LandingPage')));

// ==============================|| LANDING ROUTING ||============================== //

const LandingRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: '/',
      element: <LandingPage />
    }
  ]
};

export default LandingRoutes;
