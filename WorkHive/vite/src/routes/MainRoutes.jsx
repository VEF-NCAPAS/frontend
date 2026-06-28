import AdminRoutes from './AdminRoutes';
import CandidateRoutes from './CandidateRoutes';
import LandingRoutes from './LandingRoutes';
import RecruiterRoutes from './RecruiterRoutes';

// Each WorkHive area owns its routes and imports only its corresponding views.
const MainRoutes = [LandingRoutes, AdminRoutes, RecruiterRoutes, CandidateRoutes];

export default MainRoutes;

