import { Link } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// project imports
import config from 'config';

// assets
import workHiveIcon from 'assets/images/icons/workhive-icon.png';

export default function Logo() {
  return (
    <Link to={config.defaultPath} aria-label="WorkHive" style={{ textDecoration: 'none' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box component="img" src={workHiveIcon} alt="" sx={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 1 }} />
        <Typography variant="h4" sx={{ color: 'text.heading' }}>
          Work<span style={{ color: '#f2b72e' }}>Hive</span>
        </Typography>
      </Box>
    </Link>
  );
}
