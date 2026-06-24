import { Link } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';

// project imports
import config from 'config';

// assets
import workHiveLogo from 'assets/images/workhive-logo.png';

const getRoleDefaultPath = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    return config.defaultPath;
  }

  const role = String(localStorage.getItem('role') || '').trim().toUpperCase();

  if (['ADMIN', 'ADMINISTRADOR', 'ADMINISTRATOR'].includes(role)) {
    return '/admin';
  }

  if (['CANDIDATE', 'CANDIDATO'].includes(role)) {
    return '/candidato';
  }

  if (['RECRUITER', 'RECLUTADOR', 'EMPRESA', 'COMPANY'].includes(role)) {
    return '/reclutador';
  }

  return config.defaultPath;
};

export default function Logo({ clickable = true }) {
  const logo = (
    <Box
      component="img"
      src={workHiveLogo}
      alt="WorkHive"
      sx={{
        display: 'block',
        width: { xs: 160, sm: 190 },
        maxWidth: '100%',
        height: 'auto'
      }}
    />
  );

  if (!clickable) return logo;

  return (
    <Link
      to={getRoleDefaultPath()}
      aria-label="WorkHive"
      style={{ display: 'inline-flex', textDecoration: 'none' }}
    >
      {logo}
    </Link>
  );
}
