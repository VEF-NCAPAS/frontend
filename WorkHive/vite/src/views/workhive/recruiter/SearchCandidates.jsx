import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

// assets
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SchoolIcon from '@mui/icons-material/School';
import HistoryIcon from '@mui/icons-material/History';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { getAllSkills } from 'services/skillService';
import { getApplicationsByVacancy } from 'services/applicationService';
import { getVacancies } from 'services/vacancyService';

export default function SearchCandidates() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearchClicked, setHasSearchClicked] = useState(false);
  useEffect(() => {
    const loadData = async () => {
      try {
        const vacanciesResponse = await getVacancies({ page: 0, size: 50 });
        const vacancyPayload = vacanciesResponse?.data ?? vacanciesResponse;
        const vacancies = Array.isArray(vacancyPayload)
          ? vacancyPayload
          : Array.isArray(vacancyPayload?.content)
          ? vacancyPayload.content
          : Array.isArray(vacancyPayload?.data)
          ? vacancyPayload.data
          : Array.isArray(vacancyPayload?.data?.content)
          ? vacancyPayload.data.content
          : [];

        const normalizedVacancies = vacancies.map((job) => ({
          ...job,
          id: job.id ?? job.vacancyId ?? job.uuid ?? job.jobId,
          title: job.title ?? job.name ?? job.position ?? job.role ?? 'Vacante sin título',
        }));

        setJobs(normalizedVacancies);
        if (normalizedVacancies.length > 0) {
          setSelectedJobId(normalizedVacancies[0].id);
        }
      } catch (error) {
        console.error('Error loading vacancies:', error);
      }

      try {
        const skillsResponse = await getAllSkills();
        const skillPayload = skillsResponse?.data ?? skillsResponse;
        const skills = Array.isArray(skillPayload)
          ? skillPayload
          : Array.isArray(skillPayload?.data)
          ? skillPayload.data
          : [];
        setAvailableSkills(skills);
      } catch (error) {
        console.error('Error loading skills:', error);
      }
    };

    loadData();
  }, []);

  const handleSearch = async () => {
    setHasSearchClicked(true);

    if (!selectedJobId || !selectedSkill) {
      setApplications([]);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await getApplicationsByVacancy(selectedJobId, {
        skill: selectedSkill.name
      });
      const payload = response?.data ?? response;
      const apps = payload?.data?.content ?? payload?.content ?? [];

      setApplications(
        apps.map((app) => ({
          ...app,
          matchedSkills: selectedSkill ? [selectedSkill.name] : [],

          skills: app.cv?.skills ?? [],

          experience:
            app.cv?.experiences?.length > 0
              ? app.cv.experiences[0].position
              : null,

          education:
            app.cv?.education?.length > 0
              ? app.cv.education[0].major
              : null
        }))
      );
    } catch (error) {
       console.error('Error loading applications:', error);

      if (error.response?.status === 404) {
        setApplications([]);
        setErrorMessage('');
        return;
      }

      setApplications([]);
      setErrorMessage(
        'No se pudieron cargar las postulaciones. Intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };


 
  const handleViewProfile = (app) => {
    navigate('/reclutador/postulantes', {
      state: {
        selectedJobId,
        applicationId: app.id,
        candidateId: app.candidateId || app.candidateId || app.candidate?.id
      }
    });
  };

  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  return (
    <MainCard title="Búsqueda de Candidatos por Skills">
      <Stack spacing={3}>
        <Box>
          <Typography variant="h4" color="primary" fontWeight={600} mb={1}>
            Buscar candidatos por vacante y skill
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Selecciona una vacante y una skill disponible en el sistema para filtrar los candidatos que ya postularon a esa oferta.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
            <FormControl fullWidth sx={{ minWidth: 240 }}>
              <InputLabel id="vacancy-selector-label">Vacante</InputLabel>
              <Select
                labelId="vacancy-selector-label"
                label="Vacante"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {jobs.map((job) => (
                  <MenuItem key={job.id} value={job.id}>
                    {job.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              value={selectedSkill}
              onChange={(event, newValue) => setSelectedSkill(newValue)}
              options={availableSkills}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Skill"
                  placeholder="Selecciona una skill"
                  sx={{ borderRadius: 2 }}
                />
              )}
            />

            <Button
              variant="contained"
              color="secondary"
              onClick={handleSearch}
              disabled={!selectedJobId || !selectedSkill || isLoading}
              sx={{ height: 56, borderRadius: 2, whiteSpace: 'nowrap' }}
            >
              Buscar
            </Button>
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Typography variant="h5" fontWeight={600} color="text.primary" mb={2}>
            Candidatos Encontrados ({applications.length})
          </Typography>

          {!selectedJobId || !selectedSkill ? (
            <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3, borderStyle: 'dashed' }}>
              <PersonSearchIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 1 }} />
              <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                Selecciona una vacante y una skill para iniciar la búsqueda.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Las skills se cargan desde el backend y solo puedes elegir opciones válidas para la búsqueda.
              </Typography>
            </Paper>
          ) : isLoading ? (
            <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                Cargando postulaciones...
              </Typography>
            </Paper>
          ) : errorMessage ? (
            <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3, borderStyle: 'dashed' }}>
              <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                {errorMessage}
              </Typography>
            </Paper>
          ) : applications.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3, borderStyle: 'dashed' }}>
              <PersonSearchIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 1 }} />
              <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                No hay candidatos con esa skill para la vacante seleccionada.
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Prueba seleccionando otra skill o revisa las postulaciones de la vacante.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {applications.map((app) => {
                const candidateName = app.candidateName || 'Candidato';
                const candidateEmail = app.candidateEmail || '';
                const matchedSkills = app.matchedSkills || [];
                const candidateSkills = app.skills || [];

                return (
                  <Grid item xs={12} md={6} key={app.id || app.applicationId || `${app.id}-${candidateEmail}`}>
                    <Card sx={{ 
                      border: '1px solid', 
                      borderColor: 'grey.200', 
                      borderRadius: 3,
                      boxShadow: 'none',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
                      }
                    }}>
                      <CardContent sx={{ pb: '16px !important' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                          <Box display="flex" gap={1.5} alignItems="center">
                            <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.dark', fontWeight: 700 }}>
                              {candidateName.split(' ').map((n) => n[0] || '').join('')}
                            </Avatar>
                            <Box>
                              <Typography variant="h4" fontWeight={600}>
                                {candidateName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {candidateEmail}
                              </Typography>
                            </Box>
                          </Box>

                          
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, lineHeight: 1.6 }}>
                          <HistoryIcon sx={{ fontSize: 18 }} />
                          <span>Experiencia: {app.experience || 'No disponible'}</span>
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, lineHeight: 1.6 }}>
                          <SchoolIcon sx={{ fontSize: 18 }} />
                          <span>Educación: {app.education || 'No disponible'}</span>
                        </Typography>

                        {matchedSkills.length > 0 && (
                          <Paper elevation={0} sx={{ p: 1, px: 1.5, bgcolor: 'success.light', border: '1px dashed', borderColor: 'success.200', borderRadius: 2, mb: 2 }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5} alignItems="center">
                              <WorkspacePremiumIcon color="success" sx={{ fontSize: 18 }} />
                              <Typography variant="caption" color="success.dark" fontWeight={700}>COINCIDENCIAS:</Typography>
                              {matchedSkills.map((ms) => (
                                <Chip key={ms} label={ms} size="small" color="success" sx={{ height: 16, fontSize: 10, color: '#57714e', fontWeight: 600 }} />
                              ))}
                            </Stack>
                          </Paper>
                        )}

                        <Divider sx={{ my: 1.5 }} />

                        <Box mb={2}>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1} sx={{ fontWeight: 600 }}>
                            TODOS LOS SKILLS:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" gap={0.5}>
                            {candidateSkills.map((skill) => {
                              const isMatched = matchedSkills.includes(skill);
                              return (
                                <Chip
                                  key={skill}
                                  label={skill}
                                  size="small"
                                  color={isMatched ? 'success' : 'default'}
                                  variant={isMatched ? 'filled' : 'outlined'}
                                  sx={{ 
                                    fontSize: 10,
                                    color: isMatched ? '#fff' : 'text.primary',
                                    fontWeight: isMatched ? 600 : 400
                                  }}
                                />
                              );
                            })}
                          </Box>
                        </Box>

                        <Divider sx={{ my: 1.5 }} />

                        <Box display="flex" justifyContent="flex-end">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleViewProfile(app)}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                          >
                            Ver Perfil
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      </Stack>
    </MainCard>
  );
}
