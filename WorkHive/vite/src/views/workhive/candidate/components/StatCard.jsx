import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

export default function StatCard({ value, label, color = 'secondary' }) {
  return (
    <MainCard border contentSX={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Typography variant="h2" color={`${color}.dark`} sx={{ mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </MainCard>
  );
}
