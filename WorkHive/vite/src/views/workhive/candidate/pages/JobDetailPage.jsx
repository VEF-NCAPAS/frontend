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
import { buttonSX, jobs } from '../data/candidateData';

import { IconArrowLeft, IconBriefcase, IconBuilding, IconCash, IconClock, IconMapPin } from '@tabler/icons-react';

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
  const job = jobs.find((item) => item.id === jobId);

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
      <Button component={Link} to="/candidato/buscar-empleos" startIcon={<IconArrowLeft size={18} />} sx={{ ...buttonSX, mb: 2 }}>
        Volver a ofertas
      </Button>

      <MainCard border contentSX={{ p: { xs: 2.5, sm: 3.5 }, '&:last-child': { pb: { xs: 2.5, sm: 3.5 } } }} sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ sm: 'center' }}>
          <Avatar variant="rounded" sx={{ bgcolor: 'secondary.light', color: 'secondary.main', height: 58, width: 58 }}>
            <IconBuilding size={29} />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h2">{job.title}</Typography>
            <Typography variant="h4" color="text.secondary" sx={{ mt: 0.5 }}>
              {job.company}
            </Typography>
          </Box>
          <Button variant="contained" color="secondary" sx={buttonSX}>
            Aplicar a esta oferta
          </Button>
        </Stack>

        <Stack direction="row" spacing={2.5} useFlexGap flexWrap="wrap" sx={{ mt: 3 }}>
          {[
            [IconMapPin, job.location],
            [IconBriefcase, job.type],
            [IconClock, job.posted],
            [IconCash, job.salary]
          ].map(([Icon, label]) => (
            <Stack direction="row" spacing={0.75} alignItems="center" key={label}>
              <Icon size={18} />
              <Typography variant="body2">{label}</Typography>
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
            <MainCard title="Responsabilidades" border>
              <DetailList items={job.responsibilities} />
            </MainCard>
            <MainCard title="Requisitos para aplicar" border>
              <DetailList items={job.requirements} />
            </MainCard>
            <MainCard title="Beneficios" border>
              <DetailList items={job.benefits} />
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
                <Typography variant="subtitle1">{job.modality}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Habilidades buscadas
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 1 }}>
                  {job.tags.map((tag) => (
                    <Chip key={tag} label={tag} size="small" color="secondary" variant="outlined" />
                  ))}
                </Stack>
              </Box>
              <Button fullWidth variant="contained" color="secondary" sx={buttonSX}>
                Enviar postulación
              </Button>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}
