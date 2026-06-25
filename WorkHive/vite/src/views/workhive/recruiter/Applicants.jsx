import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// material-ui
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// assets
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import {
  getApplicationById,
  getApplicationsByVacancy,
  reviewApplication,
  updateApplicationStatus
} from 'services/applicationService';
import { createInterview, updateInterview } from 'services/interviewService';
import {
  createPrivateComment,
  deletePrivateComment,
  getPrivateCommentsByApplication,
  updatePrivateComment
} from 'services/privateCommentService';
import { createTechnicalTest, updateTechnicalTest } from 'services/technicalTestService';
import { getVacancies } from 'services/vacancyService';

const APPLICATION_STAGES = [
  { value: 'REVIEWED', label: 'Revisado', action: 'review' },
  { value: 'SELECTED', label: 'Seleccionado', action: 'status' },
  { value: 'REJECTED', label: 'Rechazado', action: 'status' }
];
const COMMENT_STAGES = [
  { value: 'REVIEWED', label: 'Revisado' },
  {value: 'INTERVIEW', label: 'Entrevista'},
  {value: 'TECHNICAL_TEST', label: 'Prueba Tecnica' },
  { value: 'SELECTED', label: 'Seleccionado'},
  { value: 'REJECTED', label: 'Rechazado' }
  
]
const normalizeList = (response) => {
  const payload = response?.data ?? response;
  return Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.content)
    ? payload.content
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.data?.content)
    ? payload.data.content
    : [];
};

const normalizeVacancies = (response) =>
  normalizeList(response).map((job) => ({
    ...job,
    id: job.id ?? job.vacancyId ?? job.uuid ?? job.jobId,
    title: job.title ?? job.name ?? job.position ?? job.role ?? 'Vacante sin titulo'
  }));

const normalizeApplication = (app) => {
  const cv = app?.cv || {};
  const firstExperience = cv.experiences?.[0];
  const firstEducation = cv.education?.[0];

  return {
    ...app,
    status: app.applicationStatus ?? app.status ?? 'APPLIED',
    presentationLetter: app.coverLetter ?? app.presentationLetter ?? '',
    candidate: {
      name: app.candidateName ?? cv.name ?? app.candidate?.name ?? 'Candidato sin nombre',
      email: app.candidateEmail ?? cv.email ?? app.candidate?.email ?? '',
      summary: cv.professionalSummary ?? app.candidate?.summary ?? '',
      location: [cv.city, cv.location].filter(Boolean).join(', '),
      skills: cv.skills ?? app.candidate?.skills ?? [],
      experiences: cv.experiences ?? [],
      education: cv.education ?? [],
      languages: cv.languages ?? [],
      experienceText: firstExperience
        ? `${firstExperience.position || ''}${firstExperience.company ? ` en ${firstExperience.company}` : ''}`
        : 'Sin experiencia registrada.',
      educationText: firstEducation
        ? `${firstEducation.major || ''}${firstEducation.institution ? ` - ${firstEducation.institution}` : ''}`
        : 'Sin educacion registrada.'
    },
    technicalTest: app.technicalTest ?? null,
    interview: app.interview ?? null,
    score: app.score ?? 75
  };
};

const getTechnicalTestLink = (technicalTest) => (typeof technicalTest === 'string' ? technicalTest : technicalTest?.link || technicalTest?.url || '');
const getTechnicalTestId = (technicalTest) => (typeof technicalTest === 'string' ? null : technicalTest?.id || technicalTest?.technicalTestId || null);
const getTechnicalTestDeadline = (technicalTest) => (typeof technicalTest === 'string' ? '' : technicalTest?.deadline || '');
const getInterviewId = (interview) => interview?.id || interview?.interviewId || null;
const getInterviewDateTime = (interview) => interview?.interviewDate || interview?.date || '';
const getInterviewMeetingLink = (interview) => interview?.meetingLink || interview?.link || interview?.url || '';
const toDatetimeLocalValue = (value) => {
  if (!value) return '';
  return String(value).slice(0, 16);
};
const toLocalDateTimePayload = (value) => {
  if (!value) return '';
  return value.length === 16 ? `${value}:00` : value;
};

const normalizeComment = (comment) => ({
  ...comment,
  id: comment.id ?? comment.commentId ?? comment.privateCommentId,
  description: comment.description ?? comment.comment ?? '',
  status: comment.statusAtCreation ?? comment.status ?? comment.applicationStatus,
  commentDate: comment.commentDate,
  createdAt: comment.createdAt ?? comment.commentDate ?? comment.date ?? comment.createdDate,
  updatedAt: comment.updatedAt,
  recruiterName: comment.recruiterName
});

const getStatusLabel = (status) => APPLICATION_STAGES.find((stage) => stage.value === status)?.label || status;

const getStageColor = (status) => {
  switch (status) {
    case 'REVIEWED':
      return 'info';
    case 'SELECTED':
      return 'success';
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
  }
};

const getScoreColor = (score) => {
  if (score >= 80) return { bg: 'success.light', text: 'success.dark', border: 'success.main' };
  if (score >= 50) return { bg: 'warning.light', text: 'warning.dark', border: 'warning.main' };
  return { bg: 'error.light', text: 'error.dark', border: 'error.main' };
};

export default function Applicants() {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [savingTechnicalTest, setSavingTechnicalTest] = useState(false);
  const [savingInterview, setSavingInterview] = useState(false);
  const [savingComment, setSavingComment] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [notification, setNotification] = useState(null);
  const [technicalTestLink, setTechnicalTestLink] = useState('');
  const [technicalTestDeadline, setTechnicalTestDeadline] = useState('');
  const [interviewDateTime, setInterviewDateTime] = useState('');
  const [interviewLink, setInterviewLink] = useState('');
  const [activeCommentStatus, setActiveCommentStatus] = useState('APPLIED');
  const [privateComments, setPrivateComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  const showNotification = (type, text) => {
    setNotification({ type, text });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadApplications = async (vacancyId, preferredApplicationId = null) => {
    if (!vacancyId) {
      setApplicants([]);
      setSelectedApp(null);
      return;
    }

    setLoadingApplicants(true);

    try {
      const response = await getApplicationsByVacancy(vacancyId, { page: 0, size: 20 });
      const apps = normalizeList(response).map(normalizeApplication);
      setApplicants(apps);

      const appToSelect = apps.find((app) => app.id === preferredApplicationId) || apps[0] || null;
      if (appToSelect) {
        await handleSelectApp(appToSelect, false);
      } else {
        setSelectedApp(null);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setApplicants([]);
      setSelectedApp(null);
      showNotification('error', 'No se pudieron cargar las postulaciones de esta vacante.');
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    const loadVacancies = async () => {
      setLoadingJobs(true);

      try {
        const response = await getVacancies({ page: 0, size: 50 });
        const vacancies = normalizeVacancies(response);
        setJobs(vacancies);

        const initialJobId = location.state?.selectedJobId || vacancies[0]?.id || '';
        setSelectedJobId(initialJobId);
        if (initialJobId) {
          await loadApplications(initialJobId, location.state?.applicationId);
        }
      } catch (error) {
        console.error('Error loading vacancies:', error);
        showNotification('error', 'No se pudieron cargar las vacantes.');
      } finally {
        setLoadingJobs(false);
      }
    };

    loadVacancies();
  }, [location.state?.selectedJobId, location.state?.applicationId]);

  const handleJobChange = async (event) => {
    const vacancyId = event.target.value;
    setSelectedJobId(vacancyId);
    setActiveTab(0);
    await loadApplications(vacancyId);
  };

  const handleSelectApp = async (app, changeTab = true) => {
    setLoadingDetail(true);

    try {
      const response = await getApplicationById(app.id);
      const detailPayload = response?.data ?? response;
      const detail = detailPayload?.data ?? detailPayload;
      const normalizedDetail = normalizeApplication(detail);
      setSelectedApp(normalizedDetail);
      setTechnicalTestLink(getTechnicalTestLink(normalizedDetail.technicalTest));
      setTechnicalTestDeadline(toDatetimeLocalValue(getTechnicalTestDeadline(normalizedDetail.technicalTest)));
      setInterviewDateTime(toDatetimeLocalValue(getInterviewDateTime(normalizedDetail.interview)));
      setInterviewLink(getInterviewMeetingLink(normalizedDetail.interview));
      if (changeTab) setActiveTab(0);
    } catch (error) {
      console.error('Error loading application detail:', error);
      setSelectedApp(app);
      setTechnicalTestLink(getTechnicalTestLink(app.technicalTest));
      setTechnicalTestDeadline(toDatetimeLocalValue(getTechnicalTestDeadline(app.technicalTest)));
      setInterviewDateTime(toDatetimeLocalValue(getInterviewDateTime(app.interview)));
      setInterviewLink(getInterviewMeetingLink(app.interview));
      showNotification('error', 'No se pudo cargar el detalle completo de la postulacion.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleStageChange = async (stage) => {
    if (!selectedApp || selectedApp.status === stage.value || !stage.action) return;

    try {
      if (stage.action === 'review') {
        await reviewApplication(selectedApp.id);
      } else {
        await updateApplicationStatus(selectedApp.id, { status: stage.value });
      }

      await loadApplications(selectedJobId, selectedApp.id);
      showNotification('success', `Postulacion actualizada a: ${stage.label}.`);
    } catch (error) {
      console.error('Error updating application status:', error);
      showNotification('error', error?.response?.data?.message || 'No se pudo actualizar el estado de la postulacion.');
    }
  };

  const loadPrivateComments = async (applicationId, status = activeCommentStatus) => {
    if (!applicationId) return;

    setLoadingComments(true);

    try {
      const response = await getPrivateCommentsByApplication(applicationId, {
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        status
      });
      const comments = normalizeList(response).map(normalizeComment);
      setPrivateComments(comments);
      if (selectedCommentId) {
        const selectedComment = comments.find((comment) => comment.id === selectedCommentId);
        setCommentText(selectedComment?.description || '');
      } else {
        setCommentText('');
      }
    } catch (error) {
      console.error('Error loading private comments:', error);
      setPrivateComments([]);
      setCommentText('');
      setSelectedCommentId(null);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    if (!selectedApp?.id) return;
    setSelectedCommentId(null);
    setCommentText('');
    loadPrivateComments(selectedApp.id, activeCommentStatus);
  }, [selectedApp?.id, activeCommentStatus]);

  const handleSavePrivateComment = async () => {
    if (!selectedApp || !commentText.trim()) {
      showNotification('error', 'Escribe un comentario privado antes de guardar.');
      return;
    }

    setSavingComment(true);

    try {
      if (selectedCommentId) {
        await updatePrivateComment(selectedCommentId, {
          description: commentText.trim()
        });
      } else {
        await createPrivateComment({
          applicationId: selectedApp.id,
          description: commentText.trim()
        });
      }

      setSelectedCommentId(null);
      setCommentText('');
      await loadPrivateComments(selectedApp.id, activeCommentStatus);
      showNotification('success', 'Comentario privado guardado.');
    } catch (error) {
      console.error('Error saving private comment:', error);
      showNotification('error', error?.response?.data?.message || 'No se pudo guardar el comentario privado.');
    } finally {
      setSavingComment(false);
    }
  };

  const handleNewPrivateComment = () => {
    setSelectedCommentId(null);
    setCommentText('');
  };

  const handleEditPrivateComment = (comment) => {
    setSelectedCommentId(comment.id);
    setCommentText(comment.description || '');
  };

  const handleDeletePrivateComment = async (commentId) => {
    if (!selectedApp || !commentId) return;

    setSavingComment(true);

    try {
      await deletePrivateComment(commentId);
      if (selectedCommentId === commentId) {
        setSelectedCommentId(null);
        setCommentText('');
      }
      await loadPrivateComments(selectedApp.id, activeCommentStatus);
      showNotification('success', 'Comentario privado eliminado.');
    } catch (error) {
      console.error('Error deleting private comment:', error);
      showNotification('error', error?.response?.data?.message || 'No se pudo eliminar el comentario privado.');
    } finally {
      setSavingComment(false);
    }
  };

  const refreshSelectedApplication = async () => {
    if (!selectedApp) return;
    await loadApplications(selectedJobId, selectedApp.id);
  };

  const handleSaveTechnicalTest = async () => {
    if (!selectedApp || !technicalTestLink.trim() || !technicalTestDeadline) {
      showNotification('error', 'Ingresa el enlace y la fecha limite de la prueba tecnica.');
      return;
    }

    const technicalTestId = getTechnicalTestId(selectedApp.technicalTest);
    const payload = {
      applicationId: selectedApp.id,
      externalLink: technicalTestLink.trim(),
      deadline: toLocalDateTimePayload(technicalTestDeadline)
    };

    setSavingTechnicalTest(true);

    try {
      if (technicalTestId) {
        await updateTechnicalTest(technicalTestId, payload);
      } else {
        await createTechnicalTest(payload);
      }

      await refreshSelectedApplication();
      showNotification('success', technicalTestId ? 'Prueba tecnica actualizada.' : 'Prueba tecnica asignada.');
    } catch (error) {
      console.error('Error saving technical test:', error);
      showNotification('error', error?.response?.data?.message || 'No se pudo guardar la prueba tecnica.');
    } finally {
      setSavingTechnicalTest(false);
    }
  };

  const handleSaveInterview = async () => {
    if (!selectedApp || !interviewDateTime || !interviewLink.trim()) {
      showNotification('error', 'Ingresa fecha, hora y enlace de videollamada para la entrevista.');
      return;
    }

    const interviewId = getInterviewId(selectedApp.interview);
    const payload = {
      applicationId: selectedApp.id,
      interviewDate: toLocalDateTimePayload(interviewDateTime),
      meetingLink: interviewLink.trim()
    };

    setSavingInterview(true);

    try {
      if (interviewId) {
        await updateInterview(interviewId, payload);
      } else {
        await createInterview(payload);
      }

      await refreshSelectedApplication();
      showNotification('success', interviewId ? 'Entrevista actualizada.' : 'Entrevista agendada.');
    } catch (error) {
      console.error('Error saving interview:', error);
      showNotification('error', error?.response?.data?.message || 'No se pudo guardar la entrevista.');
    } finally {
      setSavingInterview(false);
    }
  };

  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  return (
    <MainCard
      title="Gestion de Postulantes"
      secondary={
        <FormControl size="small" sx={{ minWidth: 280 }}>
          <InputLabel id="job-selector-label">Vacante</InputLabel>
          <Select
            labelId="job-selector-label"
            label="Vacante"
            value={selectedJobId}
            onChange={handleJobChange}
            disabled={loadingJobs}
            sx={{ borderRadius: 2 }}
          >
            {jobs.map((job) => (
              <MenuItem key={job.id} value={job.id}>
                {job.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      }
    >
      <Stack spacing={2.5}>
        

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 3, overflow: 'hidden' }}>
              <Box p={2} bgcolor="grey.50" borderBottom="1px solid" borderColor="grey.200" display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={600}>
                  Candidatos ({applicants.length})
                </Typography>
                {loadingApplicants && <CircularProgress size={18} />}
              </Box>

              {!selectedJobId ? (
                <Box p={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    Selecciona una vacante para ver sus postulaciones.
                  </Typography>
                </Box>
              ) : applicants.length === 0 && !loadingApplicants ? (
                <Box p={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No hay postulaciones registradas para esta vacante aun.
                  </Typography>
                </Box>
              ) : (
                <List sx={{ py: 0, maxHeight: 620, overflowY: 'auto' }}>
                  {applicants.map((app) => {
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
                            <Avatar
                              sx={{
                                bgcolor: isSelected ? 'primary.main' : 'secondary.light',
                                color: isSelected ? '#fff' : 'secondary.main',
                                width: 38,
                                height: 38,
                                border: '1px solid',
                                borderColor: isSelected ? 'primary.main' : 'secondary.200'
                              }}
                            >
                              <PersonOutlineIcon sx={{ fontSize: 22 }} />
                            </Avatar>
                          </ListItemAvatar>

                          <ListItemText
                            primary={
                              <Typography variant="subtitle1" fontWeight={600} color={isSelected ? 'primary.800' : 'text.primary'}>
                                {app.candidate.name}
                              </Typography>
                            }
                            secondary={
                              <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                                <Typography variant="caption" color="text.secondary">
                                  {app.applicationDate}
                                </Typography>
                                <Chip
                                  label={getStatusLabel(app.status)}
                                  size="small"
                                  color={getStageColor(app.status)}
                                  sx={{ height: 18, fontSize: 10, fontWeight: 600 }}
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

          <Grid item xs={12} md={8}>
            {!selectedApp ? (
              <Paper
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'grey.200',
                  borderRadius: 3,
                  p: 8,
                  textAlign: 'center',
                  minHeight: 420,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <SearchIcon sx={{ fontSize: 70, color: 'text.secondary', opacity: 0.2, mb: 2 }} />
                <Typography variant="h4" color="text.secondary" gutterBottom>
                  Ningun candidato seleccionado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Selecciona un candidato de la lista para ver su CV y gestionar su proceso.
                </Typography>
              </Paper>
            ) : (
              <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                {loadingDetail && (
                  <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.5)', zIndex: 2, display: 'grid', placeItems: 'center' }}>
                    <CircularProgress />
                  </Box>
                )}

                <Box p={3} bgcolor="grey.50" borderBottom="1px solid" borderColor="grey.200">
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main', color: '#fff', width: 48, height: 48 }}>
                          <PersonOutlineIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h3" fontWeight={700}>
                            {selectedApp.candidate.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedApp.candidate.email}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Postulado para: {selectedApp.vacancyTitle || selectedJob?.title}
                          </Typography>
                        </Box>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4} textAlign={{ xs: 'left', sm: 'right' }}>
                      <Chip label={getStatusLabel(selectedApp.status)} color={getStageColor(selectedApp.status)} sx={{ fontWeight: 700 }} />
                    </Grid>
                  </Grid>
                </Box>

                <Tabs value={activeTab} onChange={(event, value) => setActiveTab(value)} sx={{ borderBottom: 1, borderColor: 'grey.200', px: 2 }}>
                  <Tab label="CV Digital e Informacion" sx={{ fontWeight: 600 }} />
                  <Tab label="Gestion de Etapa" sx={{ fontWeight: 600 }} />
                </Tabs>
                {notification && (
                  <Alert severity={notification.type} sx={{ borderRadius: 2 }} onClose={() => setNotification(null)}>
                    {notification.text}
                  </Alert>
                )}

                {activeTab === 0 && (
                  <Box p={3}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'primary.light', border: '1px solid', borderColor: 'primary.100', borderRadius: 2 }}>
                          <Typography variant="subtitle1" fontWeight={600} color="primary.dark" gutterBottom>
                            Carta de Presentacion
                          </Typography>
                          <Typography variant="body2" sx={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                            "{selectedApp.presentationLetter || 'Sin carta de presentacion proporcionada.'}"
                          </Typography>
                        </Paper>
                      </Grid>

                      {selectedApp.candidate.summary && (
                        <Grid item xs={12}>
                          <Typography variant="h5" fontWeight={600} gutterBottom>
                            Resumen profesional
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedApp.candidate.summary}
                          </Typography>
                        </Grid>
                      )}

                      <Grid item xs={12}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                          Habilidades Tecnicas
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                          {selectedApp.candidate.skills.length > 0 ? (
                            selectedApp.candidate.skills.map((skill) => (
                              <Chip key={skill} label={skill} color="secondary" variant="outlined" sx={{ fontWeight: 500 }} />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Sin skills registradas.
                            </Typography>
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                          Experiencia Laboral
                        </Typography>
                        <Stack spacing={1}>
                          {selectedApp.candidate.experiences.length > 0 ? (
                            selectedApp.candidate.experiences.map((experience) => (
                              <Paper key={experience.id || `${experience.company}-${experience.position}`} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                <Typography variant="subtitle2" fontWeight={700}>
                                  {experience.position}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {experience.company}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                  {experience.description}
                                </Typography>
                              </Paper>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {selectedApp.candidate.experienceText}
                            </Typography>
                          )}
                        </Stack>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                          Educacion
                        </Typography>
                        <Stack spacing={1}>
                          {selectedApp.candidate.education.length > 0 ? (
                            selectedApp.candidate.education.map((education) => (
                              <Paper key={education.id || `${education.institution}-${education.major}`} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                <Typography variant="subtitle2" fontWeight={700}>
                                  {education.major}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {education.institution}
                                </Typography>
                              </Paper>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              {selectedApp.candidate.educationText}
                            </Typography>
                          )}
                        </Stack>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box p={3}>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="h5" fontWeight={600} mb={1.5}>
                          Cambio de etapa del proceso
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {APPLICATION_STAGES.map((stage) => {
                            const isActive = selectedApp.status === stage.value;
                            return (
                              <Button
                                key={stage.value}
                                variant={isActive ? 'contained' : 'outlined'}
                                color={isActive ? getStageColor(stage.value) : 'secondary'}
                                onClick={() => handleStageChange(stage)}
                                disabled={isActive || !stage.action}
                                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                                endIcon={isActive ? <CheckCircleOutlineIcon sx={{ fontSize: 16 }} /> : null}
                              >
                                {stage.label}
                              </Button>
                            );
                          })}
                        </Box>
                      </Box>

                      <Divider />

                      <Grid container spacing={3}>
                        <Grid item xs={12} md={7}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={1.5}>
                            <Typography variant="h5" fontWeight={600}>
                              Comentarios privados por etapa
                            </Typography>
                            <FormControl size="small" sx={{ minWidth: 160 }}>
                              <Select
                                value={activeCommentStatus}
                                onChange={(event) => setActiveCommentStatus(event.target.value)}
                                sx={{ borderRadius: 2, height: 36, fontSize: 12 }}
                              >
                                {COMMENT_STAGES.map((stage) => (
                                  <MenuItem key={stage.value} value={stage.value}>
                                    {stage.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>

                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} mb={1}>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                {selectedCommentId ? 'Editando comentario privado' : 'Nuevo comentario privado'} para: {getStatusLabel(activeCommentStatus).toUpperCase()}
                              </Typography>
                              {selectedCommentId && (
                                <Button size="small" variant="text" onClick={handleNewPrivateComment} sx={{ textTransform: 'none' }}>
                                  Nuevo
                                </Button>
                              )}
                            </Box>
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              placeholder="Escribe observaciones internas sobre el candidato..."
                              value={commentText}
                              onChange={(event) => setCommentText(event.target.value)}
                            />
                            <Box display="flex" justifyContent="flex-end" mt={1.5}>
                              <Button
                                variant="contained"
                                startIcon={savingComment ? <CircularProgress color="inherit" size={18} /> : <SaveIcon />}
                                onClick={handleSavePrivateComment}
                                disabled={savingComment}
                                sx={{ borderRadius: 2, textTransform: 'none' }}
                              >
                                {selectedCommentId ? 'Actualizar comentario' : 'Crear comentario'}
                              </Button>
                            </Box>
                          </Paper>

                          <Box mt={2}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              HISTORIAL DE COMENTARIOS
                            </Typography>
                            <Stack spacing={1} mt={1}>
                              {loadingComments ? (
                                <Box py={2} textAlign="center">
                                  <CircularProgress size={22} />
                                </Box>
                              ) : privateComments.length > 0 ? (
                                privateComments.map((comment) => (
                                  <Paper
                                    key={comment.id || comment.createdAt}
                                    variant="outlined"
                                    sx={{
                                      p: 1.5,
                                      bgcolor: selectedCommentId === comment.id ? 'primary.light' : 'grey.50',
                                      borderColor: selectedCommentId === comment.id ? 'primary.main' : 'grey.300',
                                      borderRadius: 2,
                                      borderStyle: 'dashed'
                                    }}
                                  >
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={1}>
                                      <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="caption" color="primary.main" fontWeight={700}>
                                          {getStatusLabel(comment.status || activeCommentStatus)}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                                          {[comment.recruiterName, comment.commentDate || String(comment.createdAt || '').split('T')[0]].filter(Boolean).join(' • ')}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                                          {comment.description}
                                        </Typography>
                                      </Box>
                                      <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          startIcon={<EditOutlinedIcon />}
                                          onClick={() => handleEditPrivateComment(comment)}
                                          sx={{ minWidth: 0, px: 1 }}
                                        >
                                          Editar
                                        </Button>
                                        <Button
                                          size="small"
                                          variant="outlined"
                                          color="error"
                                          startIcon={<DeleteOutlineIcon />}
                                          onClick={() => handleDeletePrivateComment(comment.id)}
                                          disabled={savingComment}
                                          sx={{ minWidth: 0, px: 1 }}
                                        >
                                          Eliminar
                                        </Button>
                                      </Stack>
                                    </Box>
                                  </Paper>
                                ))
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No hay comentarios privados para esta etapa.
                                </Typography>
                              )}
                            </Stack>
                          </Box>
                        </Grid>
 
                        <Grid item xs={12} md={5}>
                          <Stack spacing={3}>
                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                              <AssignmentIcon color="primary" />
                              <Typography variant="subtitle1" fontWeight={600}>
                                Prueba tecnica
                              </Typography>
                            </Box>
                            <Stack spacing={1.5}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Enlace de prueba tecnica"
                                placeholder="https://..."
                                value={technicalTestLink}
                                onChange={(event) => setTechnicalTestLink(event.target.value)}
                              />
                              <TextField
                                fullWidth
                                size="small"
                                type="datetime-local"
                                label="Fecha limite"
                                InputLabelProps={{ shrink: true }}
                                value={technicalTestDeadline}
                                onChange={(event) => setTechnicalTestDeadline(event.target.value)}
                              />
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                <Button
                                  fullWidth
                                  variant="contained"
                                  onClick={handleSaveTechnicalTest}
                                  disabled={savingTechnicalTest}
                                  startIcon={savingTechnicalTest ? <CircularProgress color="inherit" size={18} /> : <AssignmentIcon />}
                                  sx={{ textTransform: 'none', borderRadius: 2 }}
                                >
                                  {getTechnicalTestId(selectedApp.technicalTest) ? 'Actualizar prueba' : 'Asignar prueba'}
                                </Button>
                                {getTechnicalTestLink(selectedApp.technicalTest) && (
                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<InsertLinkIcon />}
                                    component="a"
                                    href={getTechnicalTestLink(selectedApp.technicalTest)}
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                  >
                                    Abrir
                                  </Button>
                                )}
                              </Stack>
                            </Stack>
                          </Paper>

                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight={600} mb={1}>
                              Entrevista
                            </Typography>
                            <Stack spacing={1.5}>
                              <TextField
                                fullWidth
                                size="small"
                                type="datetime-local"
                                label="Fecha y hora"
                                InputLabelProps={{ shrink: true }}
                                value={interviewDateTime}
                                onChange={(event) => setInterviewDateTime(event.target.value)}
                              />
                              <TextField
                                fullWidth
                                size="small"
                                label="Enlace de videollamada"
                                placeholder="https://meet.google.com/..."
                                value={interviewLink}
                                onChange={(event) => setInterviewLink(event.target.value)}
                              />
                              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                                <Button
                                  fullWidth
                                  variant="contained"
                                  onClick={handleSaveInterview}
                                  disabled={savingInterview}
                                  startIcon={savingInterview ? <CircularProgress color="inherit" size={18} /> : <CheckCircleOutlineIcon />}
                                  sx={{ textTransform: 'none', borderRadius: 2 }}
                                >
                                  {getInterviewId(selectedApp.interview) ? 'Actualizar entrevista' : 'Agendar entrevista'}
                                </Button>
                                {interviewLink && (
                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<InsertLinkIcon />}
                                    component="a"
                                    href={interviewLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    sx={{ textTransform: 'none', borderRadius: 2 }}
                                  >
                                    Abrir sala
                                  </Button>
                                )}
                              </Stack>
                            </Stack>
                          </Paper>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Stack>
                  </Box>
                )}
              </Paper>
            )}
          </Grid>
        </Grid>
      </Stack>
    </MainCard>
  );
}
