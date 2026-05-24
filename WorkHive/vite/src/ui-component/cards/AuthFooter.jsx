import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

export default function AuthFooter() {
  return (
    <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
      <Typography variant="subtitle2" color="text.secondary">
        WorkHive
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        Plataforma de empleo y reclutamiento
      </Typography>
    </Stack>
  );
}
