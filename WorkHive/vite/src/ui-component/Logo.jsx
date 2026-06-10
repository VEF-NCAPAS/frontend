import { Link } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';

// project imports
import config from 'config';

// assets
import workHiveLogo from 'assets/images/workhive-logo.png';

export default function Logo() {
  return (
    <Link to={config.defaultPath} aria-label="WorkHive" style={{ display: 'inline-flex', textDecoration: 'none' }}>
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
    </Link>
  );
}
