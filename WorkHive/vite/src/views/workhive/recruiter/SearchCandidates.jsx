import { useState, useEffect } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Alert from '@mui/material/Alert';

// assets
import SearchIcon from '@mui/icons-material/Search';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import SchoolIcon from '@mui/icons-material/School';
import HistoryIcon from '@mui/icons-material/History';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { recruiterService } from 'services/recruiterService';

// Recommended hot skills in El Salvador
const HOT_SKILLS = ['React', 'JavaScript', 'SQL', 'PowerBI', 'Docker', 'AWS', 'Python', 'TypeScript', 'Git', 'CSS'];

export default function SearchCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  
  // Job assignment states
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');

  useEffect(() => {
    const list = recruiterService.getCandidates();
    setCandidates(list);
    setFilteredCandidates(list);
    setJobs(recruiterService.getJobs());
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    filterAndScore(value, candidates);
  };

  const handleQuickSkillClick = (skill) => {
    let newQuery = searchQuery.trim();
    if (!newQuery) {
      newQuery = skill;
    } else {
      // Split by comma
      const parts = newQuery.split(',').map((p) => p.trim());
      if (!parts.includes(skill)) {
        parts.push(skill);
      }
      newQuery = parts.join(', ');
    }
    setSearchQuery(newQuery);
    filterAndScore(newQuery, candidates);
  };

  const filterAndScore = (query, allCandidates) => {
    if (!query.trim()) {
      setFilteredCandidates(allCandidates);
      return;
    }

    // Split query by commas or spaces
    const searchSkills = query
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (searchSkills.length === 0) {
      setFilteredCandidates(allCandidates);
      return;
    }

    // Map candidates to add a dynamic score
    const scoredList = allCandidates.map((cand) => {
      const candSkills = cand.skills.map((s) => s.toLowerCase());
      
      let matchCount = 0;
      searchSkills.forEach((sk) => {
        const matches = candSkills.some((cs) => cs.includes(sk) || sk.includes(cs));
        if (matches) matchCount++;
      });

      const score = Math.round((matchCount / searchSkills.length) * 100);
      const matchedSkills = cand.skills.filter((cs) => 
        searchSkills.some((sk) => cs.toLowerCase().includes(sk) || sk.toLowerCase().includes(cs.toLowerCase()))
      );

      return {
        ...cand,
        score,
        matchedSkills
      };
    });

    // Sort by score (descending), then filter out those with 0% match if query is specific
    const finalFiltered = scoredList
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score);

    setFilteredCandidates(finalFiltered);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 50) return 'warning';
    return 'info';
  };

  // Open job selection dialog
  const handleOpenAssignDialog = (cand) => {
    setSelectedCandidate(cand);
    if (jobs.length > 0) {
      setSelectedJobId(jobs[0].id);
    }
    setIsDialogOpen(true);
  };

  // Confirm assignment and apply candidate to job
  const handleConfirmAssignment = () => {
    if (!selectedCandidate || !selectedJobId) return;

    const success = recruiterService.applyCandidateToJob(selectedCandidate.id, selectedJobId);
    
    const activeJob = jobs.find((j) => j.id === selectedJobId);

    if (success) {
      setAlertSeverity('success');
      setSuccessMessage(`¡Excelente! El candidato ${selectedCandidate.name} ha sido postulado de forma proactiva a la vacante de "${activeJob?.title}".`);
    } else {
      setAlertSeverity('warning');
      setSuccessMessage(`El candidato ${selectedCandidate.name} ya se encuentra postulado a la vacante de "${activeJob?.title}".`);
    }

    setIsDialogOpen(false);
    
    // Clear message after 4s
    setTimeout(() => {
      setSuccessMessage('');
    }, 4500);
  };

  return (
    <MainCard title="Búsqueda de Candidatos por Skills">
      <Stack spacing={3}>
        {successMessage && (
          <Alert severity={alertSeverity} sx={{ borderRadius: 2 }}>
            {successMessage}
          </Alert>
        )}

        <Box>
          <Typography variant="h4" color="primary" fontWeight={600} mb={1}>
            Buscar Talento Tecnológico
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Ingresa las tecnologías y habilidades técnicas deseadas (separadas por comas) para encontrar candidatos calificados. El sistema calculará el porcentaje de coincidencia en tiempo real.
          </Typography>

          {/* Search bar input */}
          <TextField
            fullWidth
            placeholder="Ej: React, Git, JavaScript, CSS"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: 'grey.50' }
            }}
          />

          {/* Quick Hot skills tags */}
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1} mt={2} alignItems="center">
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              SUGERENCIAS DE SKILLS EN EL SALVADOR:
            </Typography>
            {HOT_SKILLS.map((skill) => (
              <Chip
                key={skill}
                label={skill}
                size="small"
                onClick={() => handleQuickSkillClick(skill)}
                variant="outlined"
                color="secondary"
                sx={{ 
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: 'secondary.light' }
                }}
              />
            ))}
          </Stack>
        </Box>

        <Divider />

        {/* Results layout */}
        <Box>
          <Typography variant="h5" fontWeight={600} color="text.primary" mb={2}>
            Candidatos Encontrados ({filteredCandidates.length})
          </Typography>

          {filteredCandidates.length === 0 ? (
            <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 3, borderStyle: 'dashed' }}>
              <PersonSearchIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.3, mb: 1 }} />
              <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>
                Ningún candidato coincide con la búsqueda
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Prueba buscando otras habilidades como 'React', 'SQL', 'Docker' o limpia el buscador para ver el catálogo global.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredCandidates.map((cand) => {
                const hasScore = cand.score !== undefined;
                return (
                  <Grid item xs={12} md={6} key={cand.id}>
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
                              {cand.name.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Box>
                              <Typography variant="h4" fontWeight={600}>
                                {cand.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {cand.email}
                              </Typography>
                            </Box>
                          </Box>

                          {hasScore && (
                            <Box textAlign="right">
                              <Chip 
                                label={`${cand.score}% Match`} 
                                color={getScoreColor(cand.score)} 
                                size="medium"
                                sx={{ fontWeight: 700 }}
                              />
                            </Box>
                          )}
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, lineHeight: 1.6 }}>
                          <HistoryIcon sx={{ fontSize: 18 }} />
                          <span>**Experiencia:** {cand.experience}</span>
                        </Typography>

                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, lineHeight: 1.6 }}>
                          <SchoolIcon sx={{ fontSize: 18 }} />
                          <span>**Educación:** {cand.education}</span>
                        </Typography>

                        {/* Matched skills highlight */}
                        {cand.matchedSkills && cand.matchedSkills.length > 0 && (
                          <Paper elevation={0} sx={{ p: 1, px: 1.5, bgcolor: 'success.light', border: '1px dashed', borderColor: 'success.200', borderRadius: 2, mb: 2 }}>
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5} alignItems="center">
                              <WorkspacePremiumIcon color="success" sx={{ fontSize: 18 }} />
                              <Typography variant="caption" color="success.dark" fontWeight={700}>COINCIDENCIAS:</Typography>
                              {cand.matchedSkills.map((ms) => (
                                <Chip key={ms} label={ms} size="small" color="success" sx={{ height: 16, fontSize: 10, color: '#fff', fontWeight: 600 }} />
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
                            {cand.skills.map((skill) => {
                              const isMatched = cand.matchedSkills?.includes(skill);
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

                        {/* PROACTIVE ASSIGNMENT TRIGGER */}
                        <Box display="flex" justifyContent="flex-end">
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<AddCircleOutlineIcon />}
                            onClick={() => handleOpenAssignDialog(cand)}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                          >
                            Asignar a Vacante / Postular
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

      {/* ASSIGNMENT MODAL DIALOG */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Asignar Candidato a una Oferta
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Selecciona a cuál de tus ofertas de empleo activas deseas postular proactivamente a **{selectedCandidate?.name}**.
          </Typography>

          {jobs.length === 0 ? (
            <Alert severity="warning" sx={{ borderRadius: 2 }}>
              No tienes ninguna oferta de empleo activa actualmente. Primero debes crear una en la pantalla de "Publicar Oferta".
            </Alert>
          ) : (
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel id="assign-job-select-label">Oferta de Empleo</InputLabel>
              <Select
                labelId="assign-job-select-label"
                label="Oferta de Empleo"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                {jobs.map((job) => (
                  <MenuItem key={job.id} value={job.id}>
                    {job.title} ({job.modality})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => setIsDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            disabled={jobs.length === 0}
            onClick={handleConfirmAssignment}
            sx={{ borderRadius: 2 }}
          >
            Confirmar Asignación
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
