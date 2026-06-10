import PropTypes from 'prop-types';
import { useCallback } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';

export default function RolePage({ title, description }) {
  const handleSetAdmin = useCallback(() => {
    localStorage.setItem('role', 'ADMIN');
    window.location.reload();
  }, []);

  return (
    <MainCard title={title}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleSetAdmin}>
        Cambiar a rol ADMIN
      </Button>
    </MainCard>
  );
}

RolePage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
