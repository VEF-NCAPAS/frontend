import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

// assets
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import CommentIcon from '@mui/icons-material/Comment';
import SaveIcon from '@mui/icons-material/Save';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { recruiterService } from 'services/recruiterService';

const SELECTION_STAGES = [
  'Postulado',
  'Revisado',
  'Entrevista técnica',
  'Rechazado',
  'Contratado'
];

export default function Applicants() {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  
  // Tabs: 0 = CV Digital, 1 = Proceso Selección
  const [activeTab, setActiveTab] = useState(0);
  
  // Selection stage private comments
  const [activeCommentStage, setActiveCommentStage] = useState('Postulado');
  const [commentText, setCommentText] = useState('');

  // Technical Test
  const [testLink, setTestLink] = useState('');

  // Interview Schedule Dialog Modal
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewTime, setInterviewTime] = useState('');
  const [interviewLink, setInterviewLink] = useState('');

  const [notification, setNotification] = useState('');

  // Load Initial Jobs list
  useEffect(() => {
    const jobsList = recruiterService.getJobs();
    setJobs(jobsList);

    // Auto-select job from navigate state
    if (location.state?.selectedJobId) {
      setSelectedJobId(location.state.selectedJobId);
    } else if (jobsList.length > 0) {
      setSelectedJobId(jobsList[0].id);
    }
  }, [location]);

  // Load applicants whenever selected job changes
  useEffect(() => {
    if (selectedJobId) {
      const list = recruiterService.getDetailedApplicationsByJob(selectedJobId);
      setApplicants(list);
      
      // Auto-select first applicant
      if (list.length > 0) {
        setSelectedApp(list[0]);
        // Prefill values
        setTestLink(list[0].technicalTest || '');
        setCommentText(list[0].comments?.['postulado'] || '');
        setActiveCommentStage('Postulado');
        setActiveTab(0);
      } else {
        setSelectedApp(null);
      }
    }
  }, [selectedJobId]);

  // Update comment view when stage selection in comments tab changes
  useEffect(() => {
    if (selectedApp) {
      const stageKey = activeCommentStage.toLowerCase();
      setCommentText(selectedApp.comments?.[stageKey] || '');
    }
  }, [activeCommentStage, selectedApp]);

  const handleJobChange = (e) => {
    setSelectedJobId(e.target.value);
  };

  const handleSelectApp = (app) => {
    setSelectedApp(app);
    setTestLink(app.technicalTest || '');
    setCommentText(app.comments?.['postulado'] || '');
    setActiveCommentStage('Postulado');
    setActiveTab(0);
  };

  // Change Candidate Selection Status Stage
  const handleStageChange = (newStatus) => {
    if (!selectedApp) return;
    const updatedApps = recruiterService.updateApplicationStatus(selectedApp.id, newStatus);
    
    // Refresh lists and selection
    const newList = recruiterService.getDetailedApplicationsByJob(selectedJobId);
    setApplicants(newList);
    
    const refreshedApp = newList.find((a) => a.id === selectedApp.id);
    setSelectedApp(refreshedApp);

    // Also auto-switch comments to the new stage
    setActiveCommentStage(newStatus);

    showNotification(`Candidato movido a la etapa: ${newStatus}`);
  };

  // Save stage comment
  const handleSaveComment = () => {
    if (!selectedApp) return;
    recruiterService.addApplicationComment(selectedApp.id, activeCommentStage, commentText);
    
    // Refresh
    const newList = recruiterService.getDetailedApplicationsByJob(selectedJobId);
    setApplicants(newList);
    const refreshedApp = newList.find((a) => a.id === selectedApp.id);
    setSelectedApp(refreshedApp);

    showNotification(`Comentario privado para la etapa [${activeCommentStage}] guardado.`);
  };

  // Save Technical Test
  const handleSaveTestLink = () => {
    if (!selectedApp) return;
    recruiterService.updateTechnicalTest(selectedApp.id, testLink);

    // Refresh
    const newList = recruiterService.getDetailedApplicationsByJob(selectedJobId);
    setApplicants(newList);
    const refreshedApp = newList.find((a) => a.id === selectedApp.id);
    setSelectedApp(refreshedApp);

    showNotification('Enlace de prueba técnica actualizado correctamente.');
  };

  // Open Schedule Dialog Modal
  const handleOpenSchedule = () => {
    if (!selectedApp) return;
    setInterviewDate(selectedApp.interview?.date || '');
    setInterviewTime(selectedApp.interview?.time || '');
    setInterviewLink(selectedApp.interview?.link || 'https://meet.google.com/');
    setIsScheduleOpen(true);
  };

  const handleSaveSchedule = () => {
    if (!selectedApp || !interviewDate || !interviewTime) {
      alert('Por favor introduce la fecha y hora de la entrevista.');
      return;
    }
    const scheduleData = {
      date: interviewDate,
      time: interviewTime,
      link: interviewLink || 'https://meet.google.com/'
    };
    
    recruiterService.scheduleInterview(selectedApp.id, scheduleData);
    
    // Refresh
    const newList = recruiterService.getDetailedApplicationsByJob(selectedJobId);
    setApplicants(newList);
    const refreshedApp = newList.find((a) => a.id === selectedApp.id);
    setSelectedApp(refreshedApp);

    setIsScheduleOpen(false);
    showNotification('¡Entrevista de videollamada agendada y registrada en el calendario!');
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Get Score badge color
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'success.light', text: 'success.dark', font: '#fff', border: 'success.main' };
    if (score >= 50) return { bg: 'warning.light', text: 'warning.dark', font: '#fff', border: 'warning.main' };
    return { bg: 'error.light', text: 'error.dark', font: '#fff', border: 'error.main' };
  };

  // Get stage badge color
  const getStageColor = (stage) => {
    switch (stage) {
      case 'Postulado': return 'default';
      case 'Revisado': return 'info';
      case 'Entrevista técnica': return 'warning';
      case 'Contratado': return 'success';
      case 'Rechazado': return 'error';
      default: return 'default';
    }
  };

  return (
    <MainCard 
      title="Gestión de Postulantes"
      secondary={
        <FormControl size="small" sx={{ minWidth: 260 }}>
          <InputLabel id="job-selector-label">Vacante Seleccionada</InputLabel>
          <Select
            labelId="job-selector-label"
            label="Vacante Seleccionada"
            value={selectedJobId}
            onChange={handleJobChange}
            sx={{ borderRadius: 2 }}
          >
            {jobs.map((j) => (
              <MenuItem key={j.id} value={j.id}>
                {j.title} ({j.modality})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
    >
      <Stack spacing={2}>
        {notification && (
          <Alert severity="success" sx={{ borderRadius: 2 }}>
            {notification}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* APPLICANTS LIST (LEFT PANEL) */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 3, overflow: 'hidden' }}>
              <Box p={2} bgcolor="grey.50" borderBottom="1px solid" borderColor="grey.200" display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                  Candidatos ({applicants.length})
                </Typography>
                <Chip 
                  label="Ordenado por Score" 
                  size="small" 
                  color="secondary" 
                  variant="outlined" 
                  sx={{ fontSize: 10, fontWeight: 600 }} 
                />
              </Box>

              {applicants.length === 0 ? (
                <Box p={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay postulaciones registradas para esta vacante aún.
                  </Typography>
                </Box>
              ) : (
                <List sx={{ py: 0, maxHeight: 600, overflowY: 'auto' }}>
                  {applicants.map((app) => {
                    const scoreStyle = getScoreColor(app.score);
                    const isSelected = selectedApp?.id === app.id;
                    return (
                      <Box key={app.id}>
                        <ListItemButton
                          selected={isSelected}
                          onClick={() => handleSelectApp(app)}
                          sx={{
                            py: 1.5,
                            borderLeft: isSelected ? '4px solid' : '4px solid transparent',
                            borderLeftColor: 'primary.main',
                            bgcolor: isSelected ? 'primary.light' : 'transparent'
                          }}
                        >
                          <ListItemAvatar sx={{ minWidth: 45 }}>
                            <Avatar sx={{ 
                              bgcolor: scoreStyle.bg, 
                              color: scoreStyle.text,
                              fontWeight: 700,
                              fontSize: 14,
                              width: 38,
                              height: 38,
                              border: '1px solid',
                              borderColor: scoreStyle.border
                            }}>
                              {app.score}%
                            </Avatar>
                          </ListItemAvatar>
                          
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight={600} color={isSelected ? 'primary.800' : 'text.primary'}>
                                {app.candidate?.name}
                              </Typography>
                            }
                            secondary={
                              <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                                <Typography variant="caption" color="text.secondary">
                                  {app.applicationDate}
                                </Typography>
                                <Chip 
                                  label={app.status} 
                                  size="small" 
                                  color={getStageColor(app.status)} 
                                  sx={{ height: 16, fontSize: 9, fontWeight: 600 }}
                                />
                              </Stack>
                            }
                          />
                        </ListItemButton>
                        <Divider />
                      </Box>
                    );
                  })}
                </List>
              )}
            </Paper>
          </Grid>

          {/* CANDIDATE DETAILS & SELECTION PROCESS (RIGHT PANEL) */}
          <Grid item xs={12} md={8}>
            {!selectedApp ? (
              <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 3, p: 8, textAlign: 'center', minHeight: 400, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <SearchIcon sx={{ fontSize: 70, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
                <Typography variant="h4" color="text.secondary" gutterBottom>
                  Ningún Candidato Seleccionado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Selecciona un candidato de la lista izquierda para comenzar a evaluar sus habilidades y gestionar su proceso de selección.
                </Typography>
              </Paper>
            ) : (
              <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 3, overflow: 'hidden' }}>
                {/* Panel Header */}
                <Box p={3} bgcolor="grey.50" borderBottom="1px solid" borderColor="grey.200">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: 48, height: 48 }}>
                          <PersonOutlineIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h3" fontWeight={700}>
                            {selectedApp.candidate?.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Postulado para: **{jobs.find(j => j.id === selectedApp.jobId)?.title}**
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    
                    <Grid item xs={12} sm={4} textAlign={{ xs: 'left', sm: 'right' }}>
                      <Box display="inline-block" textAlign="center" mr={2}>
                        <Typography variant="caption" color="text.secondary" display="block">Matching Score</Typography>
                        <Chip 
                          label={`${selectedApp.score}% Coincidencia`} 
                          color={selectedApp.score >= 80 ? 'success' : selectedApp.score >= 50 ? 'warning' : 'error'}
                          sx={{ fontWeight: 700, mt: 0.5 }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>

                {/* Tabs selection */}
                <Tabs 
                  value={activeTab} 
                  onChange={(e, val) => setActiveTab(val)}
                  sx={{ borderBottom: 1, borderColor: 'grey.200', px: 2 }}
                >
                  <Tab label="CV Digital e Información" sx={{ fontWeight: 600 }} />
                  <Tab label="Gestión de Etapa y Evaluaciones" sx={{ fontWeight: 600 }} />
                </Tabs>

                {/* TAB CONTENT 0: DIGITAL CV */}
                {activeTab === 0 && (
                  <Box p={3}>
                    <Grid container spacing={3}>
                      {/* Presentation Letter */}
                      <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.light', border: '1px solid', borderColor: 'primary.100', borderRadius: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600} color="primary.dark" gutterBottom>
                            Carta de Presentación
                          </Typography>
                          <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.6, color: 'text.primary' }}>
                            "{selectedApp.presentationLetter || 'Sin carta de presentación proporcionada.'}"
                          </Typography>
                        </Paper>
                      </Grid>

                      {/* Technical Skills */}
                      <Grid item xs={12}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                          Habilidades Técnicas (Skills)
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                          {selectedApp.candidate?.skills.map((skill) => (
                            <Chip 
                              key={skill} 
                              label={skill} 
                              color="secondary" 
                              variant="outlined"
                              size="medium"
                              sx={{ fontWeight: 500 }}
                            />
                          ))}
                        </Box>
                      </Grid>

                      {/* Professional Experience */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                          Experiencia Laboral
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {selectedApp.candidate?.experience}
                        </Typography>
                      </Grid>

                      {/* Education */}
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                          Educación / Formación
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                          {selectedApp.candidate?.education}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {/* TAB CONTENT 1: SELECTION PROCESS & TESTING */}
                {activeTab === 1 && (
                  <Box p={3}>
                    <Grid container spacing={3}>
                      {/* Stage status modification */}
                      <Grid item xs={12}>
                        <Typography variant="h5" fontWeight={600} mb={1.5}>
                          Cambio de Etapa del Proceso
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {SELECTION_STAGES.map((stage) => {
                            const isActive = selectedApp.status === stage;
                            return (
                              <Button
                                key={stage}
                                variant={isActive ? 'contained' : 'outlined'}
                                color={isActive ? getStageColor(stage) : 'secondary'}
                                onClick={() => handleStageChange(stage)}
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                endIcon={isActive ? <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> : null}
                              >
                                {stage}
                              </Button>
                            );
                          })}
                        </Box>
                      </Grid>

                      <Grid item xs={12}><Divider /></Grid>

                      {/* Private Comments Per Stage */}
                      <Grid item xs={12} md={7}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Typography variant="h5" fontWeight={600}>
                            Comentarios Privados por Etapa
                          </Typography>
                          <FormControl size="small" sx={{ width: 150 }}>
                            <Select
                              value={activeCommentStage}
                              onChange={(e) => setActiveCommentStage(e.target.value)}
                              sx={{ borderRadius: 2, height: 32, fontSize: 12 }}
                            >
                              {SELECTION_STAGES.map((st) => (
                                <MenuItem key={st} value={st} sx={{ fontSize: 12 }}>{st}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Box>

                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1} sx={{ fontWeight: 600 }}>
                            Redactar anotación para la etapa: {activeCommentStage.toUpperCase()} (Exclusivo para Reclutadores)
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Escribe comentarios, dudas o calificaciones sobre el candidato en esta etapa en específico..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                          />
                          <Box display="flex" justifyContent="flex-end" mt={1.5}>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<SaveIcon />}
                              onClick={handleSaveComment}
                              sx={{ borderRadius: 2, textTransform: 'none' }}
                            >
                              Guardar Comentario
                            </Button>
                          </Box>
                        </Paper>

                        {/* Display existing comments summary */}
                        <Box mt={2}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>HISTORIAL DE ETAPAS:</Typography>
                          <Stack spacing={1} mt={1}>
                            {Object.keys(selectedApp.comments || {}).map((stageKey) => (
                              <Paper key={stageKey} variant="outlined" sx={{ p: 1, px: 1.5, bgcolor: 'grey.50', borderRadius: 2, borderStyle: 'dashed' }}>
                                <Typography variant="caption" color="primary.main" fontWeight={700} sx={{ textTransform: 'capitalize' }}>
                                  {stageKey}:
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ display: 'inline', ml: 1 }}>
                                  {selectedApp.comments[stageKey]}
                                </Typography>
                              </Paper>
                            ))}
                          </Stack>
                        </Box>
                      </Grid>

                      {/* Evaluations and Calendar */}
                      <Grid item xs={12} md={5}>
                        <Stack spacing={3}>
                          {/* Online Technical Test */}
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                              <AssignmentIcon color="primary" />
                              <Typography variant="subtitle1" fontWeight={600}>
                                Prueba Técnica Online
                              </Typography>
                            </Box>
                            
                            <Typography variant="caption" color="text.secondary" display="block" mb={1.5}>
                              Asigna o visualiza un enlace externo para que el candidato resuelva su evaluación técnica (ej. Coderbyte, GitHub).
                            </Typography>
                            
                            <Stack direction="row" spacing={1} mb={1.5}>
                              <TextField
                                fullWidth
                                size="small"
                                placeholder="https://enlace-externo.com/prueba"
                                value={testLink}
                                onChange={(e) => setTestLink(e.target.value)}
                              />
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleSaveTestLink}
                                sx={{ px: 2 }}
                              >
                                Guardar
                              </Button>
                            </Stack>

                            {selectedApp.technicalTest && (
                              <Button
                                fullWidth
                                variant="outlined"
                                color="primary"
                                startIcon={<InsertLinkIcon />}
                                component="a"
                                href={selectedApp.technicalTest}
                                target="_blank"
                                rel="noreferrer"
                                sx={{ textTransform: 'none', borderRadius: 2 }}
                              >
                                Probar Enlace de Evaluación
                              </Button>
                            )}
                          </Paper>

                          {/* Interview Calendar Scheduler */}
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                              <CalendarMonthIcon color="primary" />
                              <Typography variant="subtitle1" fontWeight={600}>
                                Calendario de Entrevistas
                              </Typography>
                            </Box>

                            {selectedApp.interview ? (
                              <Stack spacing={1.5}>
                                <Alert severity="info" icon={false} sx={{ py: 0.5 }}>
                                  <Typography variant="body2" fontWeight={600}>
                                    Entrevista Agendada:
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Fecha: **{selectedApp.interview.date}** a las **{selectedApp.interview.time}**
                                  </Typography>
                                </Alert>

                                <Button
                                  variant="contained"
                                  color="success"
                                  startIcon={<InsertLinkIcon />}
                                  component="a"
                                  href={selectedApp.interview.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  sx={{ textTransform: 'none', borderRadius: 2, color: '#fff' }}
                                >
                                  Entrar a Videollamada
                                </Button>

                                <Button
                                  variant="text"
                                  color="primary"
                                  onClick={handleOpenSchedule}
                                  size="small"
                                  sx={{ textTransform: 'none' }}
                                >
                                  Reprogramar Entrevista
                                </Button>
                              </Stack>
                            ) : (
                              <Stack spacing={1}>
                                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                  No has programado ninguna entrevista con videollamada para este candidato aún.
                                </Typography>
                                <Button
                                  fullWidth
                                  variant="outlined"
                                  color="secondary"
                                  startIcon={<CalendarMonthIcon />}
                                  onClick={handleOpenSchedule}
                                  sx={{ textTransform: 'none', borderRadius: 2 }}
                                >
                                  Agendar Entrevista
                                </Button>
                              </Stack>
                            )}
                          </Paper>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Paper>
            )}
          </Grid>
        </Grid>
      </Stack>

      {/* SCHEDULE INTERVIEW DIALOG MODAL */}
      <Dialog 
        open={isScheduleOpen} 
        onClose={() => setIsScheduleOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Agendar Entrevista Virtual
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Ingresa la fecha, hora y enlace de la sala de videollamada (ej: Google Meet, Zoom o Teams) para evaluar a **{selectedApp?.candidate?.name}**.
          </Typography>
          
          <Stack spacing={2.5}>
            <TextField
              fullWidth
              type="date"
              label="Fecha de la Entrevista"
              InputLabelProps={{ shrink: true }}
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
            />

            <TextField
              fullWidth
              type="time"
              label="Hora de la Entrevista"
              InputLabelProps={{ shrink: true }}
              value={interviewTime}
              onChange={(e) => setInterviewTime(e.target.value)}
            />

            <TextField
              fullWidth
              label="Enlace de Videollamada"
              placeholder="https://meet.google.com/abc-defg-hij"
              value={interviewLink}
              onChange={(e) => setInterviewLink(e.target.value)}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1 }}>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => setIsScheduleOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSaveSchedule}
            sx={{ borderRadius: 2 }}
          >
            Confirmar y Agendar
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}
