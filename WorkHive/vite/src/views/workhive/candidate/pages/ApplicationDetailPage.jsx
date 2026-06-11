import { Link, useParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import { applications, buttonSX, jobs } from '../data/candidateData';

import { IconArrowLeft, IconBriefcase, IconBuilding, IconCheck, IconClock, IconMapPin } from '@tabler/icons-react';

export default function CandidateApplicationDetailPage() {
  const { applicationId } = useParams();
  const application = applications.find((item) => item.id === applicationId);
  const linkedJob = jobs.find((job) => job.id === application?.jobId);

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

  const location = linkedJob?.location || application.location;
  const type = linkedJob?.type || application.type;
  const salary = linkedJob?.salary || application.salary;

  return (
    <>
      <Button component={Link} to="/candidato/mis-postulaciones" startIcon={<IconArrowLeft size={18} />} sx={{ ...buttonSX, mb: 2 }}>
        Volver a mis postulaciones
      </Button>

      <MainCard border contentSX={{ p: { xs: 2.5, sm: 3.5 }, '&:last-child': { pb: { xs: 2.5, sm: 3.5 } } }} sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ sm: 'center' }}>
          <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.dark', height: 58, width: 58 }}>
            <IconBriefcase size={28} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h2">{application.role}</Typography>
            <Typography variant="h4" color="text.secondary" sx={{ mt: 0.5 }}>
              {application.company}
            </Typography>
          </Box>
          <Chip label={application.status} color={application.color} variant="outlined" />
        </Stack>
      </MainCard>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <MainCard title="Estado de tu postulación" border>
              <Stack spacing={2.5}>
                {application.timeline.map((step, index) => (
                  <Stack direction="row" spacing={2} key={step.title}>
                    <Avatar
                      sx={{
                        bgcolor: step.completed ? 'success.light' : 'grey.100',
                        color: step.completed ? 'success.dark' : 'text.secondary',
                        height: 34,
                        width: 34
                      }}
                    >
                      {step.completed ? <IconCheck size={18} /> : index + 1}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{step.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {step.date}
                      </Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </MainCard>

            <MainCard title="Próximo paso" border>
              <Typography variant="body2">{application.nextStep}</Typography>
            </MainCard>

            {linkedJob && (
              <MainCard title="Información de la oferta" border>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {linkedJob.description}
                </Typography>
                <Button
                  component={Link}
                  to={`/candidato/buscar-empleos/${linkedJob.id}`}
                  variant="outlined"
                  color="secondary"
                  sx={buttonSX}
                >
                  Ver oferta completa
                </Button>
              </MainCard>
            )}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <MainCard title="Detalles del proceso" border sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Fecha de postulación
                </Typography>
                <Typography variant="subtitle1">{application.date}</Typography>
              </Box>
              <Divider />
              {location && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconMapPin size={18} />
                  <Typography variant="body2">{location}</Typography>
                </Stack>
              )}
              {type && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconClock size={18} />
                  <Typography variant="body2">{type}</Typography>
                </Stack>
              )}
              {salary && (
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconBuilding size={18} />
                  <Typography variant="body2">{salary}</Typography>
                </Stack>
              )}
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}
