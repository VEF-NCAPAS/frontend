import { Link, useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import { buttonSX, pastelBackButtonSX } from '../data/candidateData';
import { useEffect, useState } from 'react';
import { getVacancyById } from 'services/vacancyService';
import TextField from '@mui/material/TextField';
import { createApplication } from 'services/applicationService';

import { IconArrowLeft, IconBriefcase, IconBuilding, IconCash, IconCheck } from '@tabler/icons-react';

const jobMeta = [
   {
    field: 'modality',
    icon: IconBriefcase,
    background: '#eee6ff',
    color: '#6842ad'
  },
  {
    field: 'salary',
    icon: IconCash,
    background: '#dcf6e8',
    color: '#25835a'
  }
];

const modalityLabels = {
  REMOTE: 'Remoto',
  HYBRID: 'Híbrido',
  ONSITE: 'Presencial'
};

const statusLabels = {
  OPEN: 'Abierta',
  PAUSED: 'Pausada',
  CLOSE: 'Cerrada'
};


function DetailList({ items }) {
  return (
    <Stack component="ul" spacing={1.25} sx={{ m: 0, pl: 2.5 }}>
      {items.map((item) => (
        <Typography component="li" variant="body2" key={item}>
          {item}
        </Typography>
      ))}
    </Stack>
  );
}

export default function CandidateJobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const handleApply = async () => {
    try {
      
      if (!coverLetter.trim()) {
        setSnackbar({
          open: true,
          message: 'Debes ingresar una carta de presentación',
          severity: 'warning'
        });
        return;
      }
      setApplying(true);

      await createApplication({
        vacancyId: job.id,
        coverLetter
      });

      setApplicationSent(true);
      setConfirmationOpen(false);
      setCoverLetter('');
      setSnackbar({
        open: true,
        message: 'Aplicación enviada correctamente',
        severity: 'success'
      });
      
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message:
          error.response?.data?.message ||
          'No se pudo enviar la aplicación',
        severity: 'error'
      });
    } finally {
      setApplying(false);
    }
  };


  useEffect(() => {
    const loadVacancy = async () => {
      try {
        const response = await getVacancyById(jobId);

        setJob(response.data);
      } catch (error) {
        console.error(error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    loadVacancy();
  }, [jobId]);
  const [applicationSent, setApplicationSent] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  if (loading) {
    return (
      <Typography>
        Cargando vacante...
      </Typography>
    );
  }
  if (!job) {
    return (
      <PageHeading
        title="Oferta no encontrada"
        description="Esta oferta ya no está disponible o el enlace no es válido."
        action={
          <Button component={Link} to="/candidato/buscar-empleos" variant="contained" color="secondary" sx={buttonSX}>
            Volver a empleos
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2, width: '100%' }}>
        <Button
          component={Link}
          to="/candidato/buscar-empleos"
          variant="contained"
          startIcon={<IconArrowLeft size={18} />}
          sx={pastelBackButtonSX}
        >
          Volver a ofertas
        </Button>
      </Box>

      <MainCard border contentSX={{ p: { xs: 2.5, sm: 3.5 }, '&:last-child': { pb: { xs: 2.5, sm: 3.5 } } }} sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ sm: 'center' }}>
          <Avatar variant="rounded" sx={{ bgcolor: 'secondary.light', color: 'secondary.main', height: 58, width: 58 }}>
            <IconBuilding size={29} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h2">{job.title}</Typography>
            <Typography variant="h4" color="text.secondary" sx={{ mt: 0.5 }}>
              {job.companyName}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            sx={buttonSX}
            onClick={() => setConfirmationOpen(true)}
            disabled={applicationSent}
          >
            {applicationSent
              ? 'Postulación enviada'
              : 'Aplicar a esta oferta'}
          </Button>
        </Stack>

        <Stack direction="row" spacing={2.5} useFlexGap flexWrap="wrap" sx={{ mt: 3 }}>
          {jobMeta.map(({ field, icon: Icon, background, color }) => (
            <Stack direction="row" spacing={0.75} alignItems="center" key={field}>
              <Avatar sx={{ bgcolor: background, color, height: 30, width: 30 }}>
                <Icon size={17} />
              </Avatar>
              <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
                {field === 'salary'
                  ? `$${job.salary}`
                  : field === 'modality'
                    ? modalityLabels[job.modality] || job.modality
                    : job[field]}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </MainCard>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <MainCard title="Descripción del empleo" border>
              <Typography variant="body2">{job.description}</Typography>
            </MainCard>
            <MainCard title="Requisitos para aplicar" border>
              <DetailList items={job.requirements} />
            </MainCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <MainCard title="Resumen de la oferta" border sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Modalidad
                </Typography>
                <Typography variant="subtitle1">{modalityLabels[job.modality] || job.modality}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Estado
                </Typography>

                <Typography variant="subtitle1">
                  {statusLabels[job.status] || job.status}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Habilidades buscadas
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                  {job.requirements?.map((requirement) => (
                    <Chip key={requirement} label={requirement} size="small" color="secondary" variant="outlined" />
                  ))}
                </Stack>
              </Box>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>

      <Dialog open={confirmationOpen} onClose={() => setConfirmationOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Aplicar a la vacante</DialogTitle>

          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={5}
              label="Carta de presentación"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              sx={{ mt: 1 }}
            />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => setConfirmationOpen(false)}>
              Cancelar
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? 'Enviando...' : 'Enviar aplicación'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
           anchorOrigin={{
              vertical: 'top',
              horizontal: 'right'
            }}
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false
            }))
          }
        >
          <Alert
            severity={snackbar.severity}
            variant="filled"
            onClose={() =>
              setSnackbar((prev) => ({
                ...prev,
                open: false
              }))
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
    </>
  );
}
