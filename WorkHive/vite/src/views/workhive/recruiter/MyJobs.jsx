import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import CardActions from '@mui/material/CardActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';

// assets
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PostAddIcon from '@mui/icons-material/PostAdd';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { recruiterService } from 'services/recruiterService';

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = () => {
    setJobs(recruiterService.getJobs());
    setApps(recruiterService.getApplications());
  };

  useEffect(() => {
    loadData();
  }, []);

  const getApplicantsCount = (jobId) => {
    return apps.filter((app) => app.jobId === jobId).length;
  };

  const handleStatusChange = (jobId, newStatus) => {
    recruiterService.updateJobStatus(jobId, newStatus);
    loadData();
    setSuccessMessage(`El estado de la vacante se actualizó a: ${newStatus}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const activeJobsCount = jobs.filter((j) => j.status === 'Activa').length;
  const totalAppsCount = apps.length;

  return (
    <MainCard
      title="Gestión de Mis Ofertas de Empleo"
      secondary={
        <Button
          variant="contained"
          color="primary"
          startIcon={<PostAddIcon />}
          onClick={() => navigate('/reclutador/publicar-oferta')}
          sx={{ borderRadius: 2 }}
        >
          Publicar Nueva Oferta
        </Button>
      }
    >
      <Stack spacing={3}>
        {/* KPI Dashboard Ribbon */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={0} sx={{
              p: 2.5,
              bgcolor: 'primary.light',
              color: 'primary.800',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'primary.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} color="primary.dark">
                  Ofertas Activas
                </Typography>
                <Typography variant="h2" fontWeight={700} color="primary.800" sx={{ mt: 1 }}>
                  {activeJobsCount}
                </Typography>
              </Box>
              <WorkOutlineIcon sx={{ fontSize: 40, opacity: 0.7 }} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={0} sx={{
              p: 2.5,
              bgcolor: 'success.light',
              color: 'success.dark',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'success.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} color="success.dark">
                  Postulaciones Totales
                </Typography>
                <Typography variant="h2" fontWeight={700} color="success.dark" sx={{ mt: 1 }}>
                  {totalAppsCount}
                </Typography>
              </Box>
              <PeopleOutlineIcon sx={{ fontSize: 40, opacity: 0.7 }} />
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12} md={4}>
            <Paper elevation={0} sx={{
              p: 2.5,
              bgcolor: 'grey.50',
              color: 'grey.800',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                  Total de Vacantes
                </Typography>
                <Typography variant="h2" fontWeight={700} color="grey.800" sx={{ mt: 1 }}>
                  {jobs.length}
                </Typography>
              </Box>
              <CheckCircleOutlineIcon sx={{ fontSize: 40, opacity: 0.6 }} />
            </Paper>
          </Grid>
        </Grid>

        {successMessage && (
          <Alert severity="success" icon={<CheckCircleOutlineIcon />}>
            {successMessage}
          </Alert>
        )}

        {/* Jobs Grid */}
        {jobs.length === 0 ? (
          <Box py={8} textAlign="center">
            <ErrorOutlineIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h4" color="text.secondary" gutterBottom>
              No has publicado ninguna oferta de empleo aún
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              ¡Publica tu primera vacante técnica para comenzar a recibir y evaluar candidatos!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PostAddIcon />}
              onClick={() => navigate('/reclutador/publicar-oferta')}
              sx={{ borderRadius: 2 }}
            >
              Publicar Mi Primera Oferta
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {jobs.map((job) => {
              const applicantsCount = getApplicantsCount(job.id);
              return (
                <Grid item xs={12} md={6} key={job.id}>
                  <Card sx={{
                    border: '1px solid',
                    borderColor: 'grey.200',
                    borderRadius: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                    }
                  }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Box>
                          <Typography variant="h3" fontWeight={600} gutterBottom>
                            {job.title}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5}>
                            <Chip
                              label={job.modality}
                              size="small"
                              color={job.modality === 'Remoto' ? 'success' : job.modality === 'Híbrido' ? 'warning' : 'primary'}
                              variant="outlined"
                            />
                            <Chip
                              icon={<AttachMoneyIcon fontSize="small" />}
                              label={job.salary}
                              size="small"
                              variant="filled"
                              sx={{ bgcolor: 'grey.100', color: 'grey.800', fontWeight: 500 }}
                            />
                          </Stack>
                        </Box>

                        {/* Status chip or dropdown */}
                        <FormControl size="small" sx={{ width: 120 }}>
                          <Select
                            value={job.status}
                            onChange={(e) => handleStatusChange(job.id, e.target.value)}
                            sx={{
                              borderRadius: 2,
                              fontWeight: 600,
                              bgcolor: job.status === 'Activa' ? 'success.light' : job.status === 'Pausada' ? 'warning.light' : 'grey.100',
                              color: job.status === 'Activa' ? 'success.dark' : job.status === 'Pausada' ? 'warning.dark' : 'grey.700',
                              '& .MuiOutlinedInput-notchedOutline': { border: 'none' }
                            }}
                          >
                            <MenuItem value="Activa">Activa</MenuItem>
                            <MenuItem value="Pausada">Pausada</MenuItem>
                            <MenuItem value="Cerrada">Cerrada</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.6,
                          height: '4.8em' // fix height for alignments
                        }}
                      >
                        {job.description}
                      </Typography>

                      <Divider sx={{ my: 1.5 }} />

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                          <CalendarTodayIcon sx={{ fontSize: 16 }} />
                          <Typography variant="caption">
                            Publicado: {job.datePublished}
                          </Typography>
                        </Stack>

                        <Stack direction="row" spacing={0.5} alignItems="center" color="primary.main">
                          <PeopleOutlineIcon sx={{ fontSize: 18 }} />
                          <Typography variant="body2" fontWeight={600}>
                            {applicantsCount} Postulante(s)
                          </Typography>
                        </Stack>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'flex-end' }}>
                      <Button
                        size="medium"
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/reclutador/postulantes', { state: { selectedJobId: job.id } })}
                        sx={{ borderRadius: 2, px: 3 }}
                        disabled={applicantsCount === 0}
                      >
                        Ver Postulantes
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Stack>
    </MainCard>
  );
}

// Simple Divider Helper
function Divider({ sx }) {
  return <Box sx={{ width: '100%', height: '1px', bgcolor: 'grey.200', ...sx }} />;
}
