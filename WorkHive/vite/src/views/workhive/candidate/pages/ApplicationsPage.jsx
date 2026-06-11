import { Link } from 'react-router-dom';

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
import StatCard from '../components/StatCard';
import { applications, buttonSX } from '../data/candidateData';

import { IconBriefcase, IconChevronRight } from '@tabler/icons-react';

export default function CandidateApplicationsPage() {
  return (
    <>
      <PageHeading
        title="Mis postulaciones"
        description="Da seguimiento a cada proceso y preparate para tus entrevistas."
        action={
          <Button component={Link} to="/" variant="contained" color="secondary" sx={buttonSX}>
            Buscar mas empleos
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard value="08" label="Postulaciones enviadas" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard value="03" label="En revision" color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard value="01" label="Entrevista pendiente" color="primary" />
        </Grid>
      </Grid>
      <MainCard title="Actividad reciente" border contentSX={{ p: { xs: 1.5, sm: 2.5 } }}>
        <Stack divider={<Divider flexItem />}>
          {applications.map((application) => (
            <Stack
              component={Link}
              to={`/candidato/mis-postulaciones/${application.id}`}
              key={application.role}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              sx={{
                borderRadius: 2,
                color: 'inherit',
                cursor: 'pointer',
                mx: -1,
                px: 1,
                py: 2,
                textDecoration: 'none',
                transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
                '&:hover': {
                  bgcolor: 'background.default',
                  boxShadow: '0 10px 24px rgba(54, 42, 112, 0.12)',
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                  <IconBriefcase size={20} />
                </Avatar>
                <Box>
                  <Typography variant="h4">{application.role}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {application.company} - Postulado el {application.date}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Chip label={application.status} color={application.color} size="small" variant="outlined" />
                <IconChevronRight size={18} />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </MainCard>
    </>
  );
}
