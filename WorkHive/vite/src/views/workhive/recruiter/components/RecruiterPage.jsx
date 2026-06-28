import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

export default function RecruiterPage({ title, description, children }) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <MainCard>
          <Stack spacing={1}>
            <Typography variant="h2">{title}</Typography>
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          </Stack>
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <MainCard border>{children}</MainCard>
      </Grid>
    </Grid>
  );
}

RecruiterPage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};
