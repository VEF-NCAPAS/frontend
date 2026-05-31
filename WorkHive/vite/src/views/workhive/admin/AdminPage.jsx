import PropTypes from 'prop-types';
import { useCallback } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';

export default function AdminPage({ title, description }) {
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
        Establecer rol ADMIN y recargar
      </Button>
    </MainCard>
  );
}

AdminPage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};

AdminPage.defaultProps = {
  title: 'Panel de administración',
  description: 'Usa este acceso para cambiar al rol ADMIN y ver la ruta /admin.'
};
