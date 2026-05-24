import PropTypes from 'prop-types';

// material-ui
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';

export default function RolePage({ title, description }) {
  return (
    <MainCard title={title}>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </MainCard>
  );
}

RolePage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
