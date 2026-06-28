import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import RecruiterPage from '../components/RecruiterPage';

export default function RecruiterPublishJobPage() {
  return (
    <RecruiterPage title="Publicar oferta" description="Crea una nueva oportunidad laboral para tu empresa.">
      <Stack spacing={2}>
        <TextField label="Titulo de la oferta" fullWidth />
        <TextField label="Descripcion" fullWidth multiline minRows={4} />
        <Button variant="contained" color="secondary" sx={{ alignSelf: 'flex-start' }}>
          Publicar oferta
        </Button>
      </Stack>
    </RecruiterPage>
  );
}
