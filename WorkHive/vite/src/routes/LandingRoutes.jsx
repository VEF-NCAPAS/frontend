import { lazy } from 'react';

// project imports
import Loadable from 'ui-component/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

// landing routing - usa la landing page principal del proyecto
const LandingPage = Loadable(lazy(() => import('views/landing')));

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
