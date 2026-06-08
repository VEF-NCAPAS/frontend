import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useLocalStorage } from 'hooks/useLocalStorage';
import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import { buttonSX } from '../data/candidateData';

import { IconCamera, IconUpload, IconArrowLeft, IconTrash } from '@tabler/icons-react';

const defaultPhotoState = {
  photo: null
};

export default function CandidateChangePhotoPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { state: photoState, setState: setPhotoState } = useLocalStorage('candidate-profile-photo', defaultPhotoState);
  const [preview, setPreview] = useState(photoState.photo);
  const [message, setMessage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    if (!preview) {
      setMessage({ type: 'error', text: 'Selecciona una imagen antes de guardar.' });
      return;
    }

    setPhotoState({ photo: preview });
    setMessage({ type: 'success', text: 'Foto de perfil actualizada correctamente.' });
  };

  const handleDelete = () => {
    setPreview(null);
    setPhotoState({ photo: null });
    setMessage({ type: 'success', text: 'Imagen eliminada. Se usará el icono predeterminado.' });
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <IconButton
          color="secondary"
          onClick={() => navigate('/candidato/configuracion-cuenta')}
          sx={{ p: 1.5, bgcolor: 'secondary.lighter', '&:hover': { bgcolor: 'secondary.light' } }}
        >
          <IconArrowLeft size={24} />
        </IconButton>
      </Box>
      <PageHeading
        title="Cambiar fotografía"
        description="Sube una nueva foto de perfil para que tu cuenta se vea más profesional."
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard border>
            <Stack spacing={3} alignItems="center" textAlign="center">
              <Avatar
                src={preview || photoState.photo}
                sx={{ width: 112, height: 112, bgcolor: 'secondary.light', color: 'secondary.dark' }}
              >
                <IconCamera size={48} />
              </Avatar>
              <Box>
                <Typography variant="h3">Foto de perfil</Typography>
                <Typography variant="body2" color="text.secondary">
                  Elige una imagen clara y profesional para tu perfil.
                </Typography>
              </Box>
              <Stack spacing={1}>
                <Button variant="contained" color="secondary" sx={buttonSX} onClick={handleUploadClick} startIcon={<IconUpload size={18} />}>
                  Seleccionar imagen
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleFileChange}
                />
                <Typography variant="caption" color="text.secondary">
                  Formatos permitidos: JPG, PNG, SVG. Tamaño máximo 2 MB.
                </Typography>
              </Stack>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            {message && <Alert severity={message.type}>{message.text}</Alert>}
            <MainCard title="Detalles de la foto" border>
              <Stack spacing={2}>
                <Typography variant="body2">Asegúrate de que tu rostro se vea con claridad.</Typography>
                <Typography variant="body2">Elige un fondo neutro y una expresión profesional.</Typography>
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" color="secondary" sx={buttonSX} onClick={handleSave}>
                    Guardar foto
                  </Button>
                  <Button variant="outlined" color="error" sx={buttonSX} onClick={handleDelete} startIcon={<IconTrash size={18} />}>
                    Eliminar foto
                  </Button>
                </Stack>
              </Stack>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
