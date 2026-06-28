import { Link, useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import { buttonSX, pastelBackButtonSX } from '../data/candidateData';

import {
  IconAlertTriangle,
  IconArrowLeft,
  IconBriefcase,
  IconCalendarEvent,
  IconVideo,
  IconExternalLink,
  IconClipboardCheck,
  IconLogout
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { getApplicationById, withdrawApplication } from 'services/applicationService';

export default function CandidateApplicationDetailPage() {
  const { applicationId } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [message, setMessage] = useState(null);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);

  const applicationStatusLabels = {
    APPLIED: 'Aplicada',
    REVIEWED: 'En revisión',
    INTERVIEW: 'Entrevista pendiente',
    TECHNICAL_TEST: 'Prueba técnica',
    SELECTED: 'Seleccionada',
    REJECTED: 'Rechazada',
    WITHDRAWN: 'Retirada'
  };
  useEffect(() => {
    const loadApplication = async () => {
      try {
        const response = await getApplicationById(applicationId);

        setApplication(response.data?.data ?? response.data);
      } catch (error) {
        console.error(error);
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [applicationId]);

  const canWithdraw = application && !['SELECTED', 'REJECTED', 'WITHDRAWN'].includes(application.applicationStatus);

  const handleWithdraw = async () => {
    if (!application || !canWithdraw) return;

    try {
      setWithdrawing(true);
      setMessage(null);

      const response = await withdrawApplication(application.id);
      const updatedApplication = response?.data ?? response;

      setApplication((current) => ({
        ...current,
        ...updatedApplication,
        applicationStatus: updatedApplication?.applicationStatus || 'WITHDRAWN'
      }));
      setMessage({ type: 'success', text: 'Postulacion retirada correctamente.' });
      setWithdrawDialogOpen(false);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'No se pudo retirar la postulacion.'
      });
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return <Typography>Cargando postulación...</Typography>;
  }
  if (!application) {
    return (
      <PageHeading
        title="Postulación no encontrada"
        description="No pudimos encontrar el proceso solicitado."
        action={
          <Button component={Link} to="/candidato/mis-postulaciones" variant="contained" color="secondary" sx={buttonSX}>
            Volver a postulaciones
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
          to="/candidato/mis-postulaciones"
          variant="contained"
          startIcon={<IconArrowLeft size={18} />}
          sx={pastelBackButtonSX}
        >
          Volver a mis postulaciones
        </Button>
      </Box>

      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <MainCard border contentSX={{ p: { xs: 2.5, sm: 3.5 }, '&:last-child': { pb: { xs: 2.5, sm: 3.5 } } }} sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ sm: 'center' }}>
          <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.dark', height: 58, width: 58 }}>
            <IconBriefcase size={28} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h2">
              {application.vacancyTitle}
            </Typography>

            <Typography
              variant="h4"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {application.companyName}
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <Chip label={applicationStatusLabels[application.applicationStatus] || application.applicationStatus} />
            <Button
              variant="outlined"
              color="error"
              startIcon={withdrawing ? <CircularProgress color="inherit" size={18} /> : <IconLogout size={18} />}
              sx={{
                ...buttonSX,
                bgcolor: '#fff5f5',
                borderColor: '#f5b5b5',
                color: '#b42318',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#ffe7e7',
                  borderColor: '#e57373',
                  boxShadow: 'none'
                },
                '&.Mui-disabled': {
                  bgcolor: '#f7f8fa',
                  borderColor: '#dde1e6'
                }
              }}
              onClick={() => setWithdrawDialogOpen(true)}
              disabled={!canWithdraw || withdrawing}
            >
              {withdrawing ? 'Retirando...' : 'Retirar postulación'}
            </Button>
          </Stack>
        </Stack>
      </MainCard>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <MainCard title="Estado de tu postulación" border>
              <Chip
                color="secondary"
                label={
                  applicationStatusLabels[
                    application.applicationStatus
                  ] || application.applicationStatus
                }
              />
            </MainCard>

            <MainCard title="Entrevista" border>
            {application.interview ? (
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconCalendarEvent size={20} />
                  <Typography>
                    {new Date(
                      application.interview.interviewDate
                    ).toLocaleString()}
                  </Typography>
                </Stack>

                <Typography variant="body2">
                  Candidato: {application.interview.candidateName}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<IconVideo size={18} />}
                  component="a"
                  href={application.interview.meetingLink}
                  target="_blank"
                >
                  Unirse a la entrevista
                </Button>
              </Stack>
            ) : (
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Aún no tienes una entrevista asignada.
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Mantente atento a las actualizaciones de tu proceso de selección.
                </Typography>
              </Stack>
            )}
          </MainCard>
          
          <MainCard title="Prueba técnica" border>
            {application.technicalTest ? (
              <Stack spacing={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconClipboardCheck size={20} />
                  <Typography>
                    Fecha límite:
                    {' '}
                    {new Date(
                      application.technicalTest.deadline
                    ).toLocaleString()}
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<IconExternalLink size={18} />}
                  component="a"
                  href={application.technicalTest.link}
                  target="_blank"
                >
                  Realizar prueba técnica
                </Button>
              </Stack>
            ) : (
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary">
                  Aún no tienes una prueba técnica asignada.
                </Typography>

                <Typography variant="caption" color="text.secondary">
                  Si continúas avanzando en el proceso, recibirás instrucciones aquí.
                </Typography>
              </Stack>
            )}
          </MainCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <MainCard title="Detalles del proceso" border sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Fecha de postulación
                </Typography>
                
                <Typography variant="subtitle1">{application.applicationDate}</Typography>
              </Box>
              <Divider />

              {application.interview ? (
                  <>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Próxima entrevista
                      </Typography>

                      <Typography variant="subtitle2">
                        {new Date(
                          application.interview.interviewDate
                        ).toLocaleDateString()}
                      </Typography>

                      <Typography variant="body2" color="primary">
                        {new Date(
                          application.interview.interviewDate
                        ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Box>

                    <Divider />
                  </>
                ) : (
                  <>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Entrevista
                      </Typography>

                      <Typography variant="body2">
                        Pendiente de asignación
                      </Typography>
                    </Box>

                    <Divider />
                  </>
                )}

                {application.technicalTest ? (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fecha límite prueba técnica
                    </Typography>

                    <Typography variant="subtitle2">
                      {new Date(
                        application.technicalTest.deadline
                      ).toLocaleDateString()}
                    </Typography>

                    <Typography variant="body2" color="secondary">
                      {new Date(
                        application.technicalTest.deadline
                      ).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                      })}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Prueba técnica
                    </Typography>

                    <Typography variant="body2">
                      Pendiente de asignación
                    </Typography>
                  </Box>
                )}
              
            </Stack>
          </MainCard>
        </Grid>
      </Grid>

      <Dialog
        open={withdrawDialogOpen}
        onClose={() => {
          if (!withdrawing) setWithdrawDialogOpen(false);
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: '#fff0d6', color: '#b76700', width: 40, height: 40 }}>
              <IconAlertTriangle size={22} />
            </Avatar>
            <Box>
              <Typography variant="h3">Retirar postulacion</Typography>
              <Typography variant="body2" color="text.secondary">
                Esta accion no continuara tu proceso en esta vacante.
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 1 }}>
            Si confirmas, tu postulacion cambiara a retirada y el equipo de reclutamiento ya no la seguira evaluando.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            color="secondary"
            variant="outlined"
            sx={buttonSX}
            onClick={() => setWithdrawDialogOpen(false)}
            disabled={withdrawing}
          >
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            startIcon={withdrawing ? <CircularProgress color="inherit" size={18} /> : <IconLogout size={18} />}
            sx={buttonSX}
            onClick={handleWithdraw}
            disabled={withdrawing}
          >
            {withdrawing ? 'Retirando...' : 'Si, retirar'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
