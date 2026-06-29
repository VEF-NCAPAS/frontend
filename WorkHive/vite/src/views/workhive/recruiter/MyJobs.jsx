import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// assets
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import PostAddIcon from '@mui/icons-material/PostAdd';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ActionResultDialog from '../candidate/components/ActionResultDialog';
import { getAllRequirements } from 'services/requirementService';
import { deleteVacancy, getVacancies, updateVacancy } from 'services/vacancyService';

const MODALITIES = [
  { value: 'REMOTE', label: 'Remoto' },
  { value: 'HYBRID', label: 'Hibrido' },
  { value: 'ONSITE', label: 'Presencial' }
];

const STATUSES = [
  { value: 'OPEN', label: 'Abierta' },
  { value: 'PAUSED', label: 'Pausada' },
  { value: 'CLOSE', label: 'Cerrada' }
];

const statusLabels = {
  OPEN: 'Abierta',
  PAUSED: 'Pausada',
  CLOSE: 'Cerrada'
};

const statusColors = {
  OPEN: 'success',
  PAUSED: 'warning',
  CLOSE: 'default'
};

const modalityLabels = {
  REMOTE: 'Remoto',
  HYBRID: 'Hibrido',
  ONSITE: 'Presencial'
};

const getPayload = (response) => response?.data ?? response;

const normalizeList = (response) => {
  const payload = getPayload(response);
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

const getRequirementId = (requirement) =>
  requirement?.id ?? requirement?.requirementId ?? requirement?.requirement?.id ?? requirement?.skill?.id ?? null;

const getRequirementLabel = (requirement) =>
  requirement?.name ||
  requirement?.title ||
  requirement?.description ||
  requirement?.requirement?.name ||
  requirement?.requirement?.title ||
  requirement?.requirement?.description ||
  requirement?.skill?.name ||
  getRequirementId(requirement) ||
  '';

const getRequirementIds = (requirements = []) =>
  requirements
    .map(getRequirementId)
    .filter(Boolean)
    .map((id) => ({ id }));

const getRequirementText = (requirement) =>
  typeof requirement === 'string'
    ? requirement
    : requirement?.name || requirement?.title || requirement?.description || requirement?.requirement?.name || requirement?.skill?.name || '';

const formatDate = (value) => {
  if (!value) return 'N/A';
  return String(value).split('T')[0];
};

const getInitialEditForm = (job) => ({
  title: job?.title || '',
  description: job?.description || '',
  salary: job?.salary || '',
  modality: job?.modality || 'REMOTE',
  status: job?.status || 'OPEN'
});

export default function MyJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [availableRequirements, setAvailableRequirements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editForm, setEditForm] = useState(getInitialEditForm());
  const [editRequirements, setEditRequirements] = useState([]);
  const [editErrors, setEditErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [resultDialog, setResultDialog] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const requirementsResponse = await getAllRequirements();

      let page = 0;
      let last = false;
      let allVacancies = [];

      while (!last) {
        const vacanciesResponse = await getVacancies({
          page,
          size: 50
        });

        const payload = vacanciesResponse.data;

        allVacancies.push(...payload.content);

        last = payload.last;
        page++;
      }

      setJobs(allVacancies);
      setAvailableRequirements(
        normalizeList(requirementsResponse).filter((requirement) => requirement?.id)
      );
    } catch (error) {
      console.error('Error loading vacancies:', error);
      setResultDialog({
        title: 'No se pudieron cargar las vacantes',
        description: error?.response?.data?.message || 'Revisa que el backend este activo y vuelve a intentarlo.',
        type: 'cancel'
      });
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getApplicantsCount = (jobId) => apps.filter((app) => app.jobId === jobId).length;

  const resolveJobRequirements = (requirements = []) => {
    const resolvedById = getRequirementIds(requirements)
      .map((requirement) => requirement.id)
      .map(
        (id) =>
          availableRequirements.find((requirement) => getRequirementId(requirement) === id) ||
          requirements.find((requirement) => getRequirementId(requirement) === id)
      )
      .filter(Boolean);

    if (resolvedById.length > 0) return resolvedById;

    return requirements
      .map((requirement) => {
        const label = getRequirementText(requirement).toLowerCase();
        return availableRequirements.find((availableRequirement) => getRequirementLabel(availableRequirement).toLowerCase() === label);
      })
      .filter(Boolean);
  };

  const openEditDialog = (job) => {
    setEditingJob(job);
    setEditForm(getInitialEditForm(job));
    setEditRequirements(resolveJobRequirements(job.requirements));
    setEditErrors({});
  };

  useEffect(() => {
    if (!editingJob || editRequirements.length > 0) return;
    setEditRequirements(resolveJobRequirements(editingJob.requirements));
  }, [availableRequirements, editingJob]);

  const closeEditDialog = () => {
    setEditingJob(null);
    setEditForm(getInitialEditForm());
    setEditRequirements([]);
    setEditErrors({});
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateEditForm = () => {
    const errors = {};
    const salary = Number(editForm.salary);

    if (!editForm.title.trim()) errors.title = 'Ingresa el titulo.';
    if (!editForm.description.trim()) errors.description = 'Ingresa la descripcion.';
    if (!editForm.salary || Number.isNaN(salary) || salary <= 0) errors.salary = 'Ingresa un salario numerico mayor a cero.';
    if (!editForm.modality) errors.modality = 'Selecciona una modalidad.';
    if (!editForm.status) errors.status = 'Selecciona un estado.';
    if (editRequirements.length === 0) errors.requirements = 'Selecciona al menos un requisito.';

    setEditErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateJob = async () => {
    if (!editingJob || !validateEditForm()) return;

    const payload = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      salary: Number(editForm.salary),
      modality: editForm.modality,
      status: editForm.status,
      requirements: getRequirementIds(editRequirements)
    };

    setSaving(true);

    try {
      await updateVacancy(editingJob.id, payload);
      closeEditDialog();
      await loadData();
      setResultDialog({
        title: 'Vacante actualizada',
        description: 'Los cambios de la vacante fueron guardados correctamente.',
        type: 'success'
      });
    } catch (error) {
      console.error('Error updating vacancy:', error);
      setResultDialog({
        title: 'No se pudo actualizar',
        description: error?.response?.data?.message || 'Revisa los datos e intenta nuevamente.',
        type: 'cancel'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setSaving(true);

    try {
      await deleteVacancy(deleteTarget.id);
      setDeleteTarget(null);
      await loadData();
      setResultDialog({
        title: 'Vacante eliminada',
        description: 'La vacante fue eliminada correctamente.',
        type: 'success'
      });
    } catch (error) {
      console.error('Error deleting vacancy:', error);
      setResultDialog({
        title: 'No se pudo eliminar',
        description: error?.response?.data?.message || 'La vacante no pudo eliminarse en este momento.',
        type: 'cancel'
      });
    } finally {
      setSaving(false);
    }
  };

  const activeJobsCount = jobs.filter((job) => job.status === 'OPEN').length;

  return (
    <>
      <MainCard
        title="Gestion de Mis Ofertas de Empleo"
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
          <Grid container spacing={3}>
            <KpiCard title="Ofertas Abiertas" value={activeJobsCount} icon={<WorkOutlineIcon sx={{ fontSize: 40, opacity: 0.7 }} />} tone="primary" />
            <KpiCard title="Total de Vacantes" value={jobs.length} icon={<CheckCircleOutlineIcon sx={{ fontSize: 40, opacity: 0.6 }} />} />
          </Grid>

          {loading ? (
            <Box py={8} textAlign="center">
              <CircularProgress />
            </Box>
          ) : jobs.length === 0 ? (
            <Box py={8} textAlign="center">
              <ErrorOutlineIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h4" color="text.secondary" gutterBottom>
                No has publicado ninguna oferta de empleo aun
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Publica tu primera vacante tecnica para comenzar a recibir y evaluar candidatos.
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
            <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}>
              {jobs.map((job) => {
                const applicantsCount = getApplicantsCount(job.id);

                return (
                  <Grid item xs={12} md={6} key={job.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Card
                      sx={{
                        maxWidth: '600px',
                        flex: 1,
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 280,
                        maxHeight: 390,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        width: '100%',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, minHeight: 0, overflow: 'hidden' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2} gap={2}>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="h3"
                              fontWeight={600}
                              gutterBottom
                              sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '2.6em',
                                overflow: 'hidden',
                                overflowWrap: 'anywhere'
                              }}
                            >
                              {job.title}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" gap={0.5} sx={{ maxHeight: 32, overflow: 'hidden' }}>
                              <Chip
                                label={modalityLabels[job.modality] || job.modality}
                                size="small"
                                color={job.modality === 'REMOTE' ? 'success' : job.modality === 'HYBRID' ? 'warning' : 'primary'}
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

                          <Chip
                            label={statusLabels[job.status] || job.status || 'Abierta'}
                            size="small"
                            color={statusColors[job.status] || 'default'}
                            sx={{ flexShrink: 0, fontWeight: 600 }}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            display: '-webkit-box',
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.6,
                          }}
                        >
                          {job.description}
                        </Typography>

                        <Divider sx={{ my: 1.5 }} />

                        <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ minHeight: 28 }}>
                          <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                            <CalendarTodayIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">Publicado: {formatDate(job.publicationDate)}</Typography>
                          </Stack>

                          <Stack direction="row" spacing={0.5} alignItems="center" color="primary.main">
                            <PeopleOutlineIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" fontWeight={600}>
                              {applicantsCount} Postulante(s)
                            </Typography>
                          </Stack>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ flexShrink: 0, minHeight: 96, px: 2, pb: 2, pt: 0, justifyContent: 'flex-end', alignContent: 'flex-end', flexWrap: 'wrap', gap: 1 }}>
                        <Button size="medium" variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => openEditDialog(job)} sx={{ borderRadius: 2, px: 2 }}>
                          Actualizar
                        </Button>
                        <Button
                          size="medium"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => setDeleteTarget(job)}
                          sx={{ borderRadius: 2, px: 2 }}
                        >
                          Eliminar
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

      <Dialog
        open={Boolean(editingJob)}
        onClose={saving ? undefined : closeEditDialog}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            maxWidth: 980,
            width: 'calc(100% - 32px)'
          }
        }}
      >
        <DialogTitle>Actualizar vacante</DialogTitle>
        <DialogContent sx={{ px: 3, pb: 1 }}>
          <Box
            sx={{
              display: 'grid',
              gap: 2.5,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              mt: 1
            }}
          >
            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                required
                label="Titulo de la vacante"
                name="title"
                value={editForm.title}
                onChange={handleEditInputChange}
                error={Boolean(editErrors.title)}
                helperText={editErrors.title}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                required
                type="number"
                label="Salario"
                name="salary"
                value={editForm.salary}
                onChange={handleEditInputChange}
                error={Boolean(editErrors.salary)}
                helperText={editErrors.salary}
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Box>

            <Box>
              <FormControl fullWidth required error={Boolean(editErrors.modality)}>
                <InputLabel id="edit-modality-label">Modalidad</InputLabel>
                <Select labelId="edit-modality-label" label="Modalidad" name="modality" value={editForm.modality} onChange={handleEditInputChange}>
                  {MODALITIES.map((modality) => (
                    <MenuItem key={modality.value} value={modality.value}>
                      {modality.label}
                    </MenuItem>
                  ))}
                </Select>
                {editErrors.modality && <FormHelperText>{editErrors.modality}</FormHelperText>}
              </FormControl>
            </Box>

            <Box sx={{ gridColumn: '1 / -1' }}>
              <FormControl fullWidth required error={Boolean(editErrors.status)}>
                <InputLabel id="edit-status-label">Estado</InputLabel>
                <Select labelId="edit-status-label" label="Estado" name="status" value={editForm.status} onChange={handleEditInputChange}>
                  {STATUSES.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
                {editErrors.status && <FormHelperText>{editErrors.status}</FormHelperText>}
              </FormControl>
            </Box>

            <Box sx={{ gridColumn: '1 / -1' }}>
              <Autocomplete
                multiple
                options={availableRequirements}
                getOptionLabel={getRequirementLabel}
                isOptionEqualToValue={(option, value) => getRequirementId(option) === getRequirementId(value)}
                value={editRequirements}
                onChange={(event, value) => {
                  setEditRequirements(value);
                  setEditErrors((prev) => ({ ...prev, requirements: undefined }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Requisitos"
                    placeholder="Selecciona requisitos"
                    error={Boolean(editErrors.requirements)}
                    helperText={editErrors.requirements || 'Estos requisitos se enviaran como IDs.'}
                  />
                )}
              />
            </Box>

            <Box sx={{ gridColumn: '1 / -1' }}>
              <TextField
                fullWidth
                required
                multiline
                rows={5}
                label="Descripcion detallada"
                name="description"
                value={editForm.description}
                onChange={handleEditInputChange}
                error={Boolean(editErrors.description)}
                helperText={editErrors.description}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" color="secondary" onClick={closeEditDialog} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contained" startIcon={saving ? <CircularProgress color="inherit" size={18} /> : <EditOutlinedIcon />} onClick={handleUpdateJob} disabled={saving}>
            {saving ? 'Guardando...' : 'Actualizar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(deleteTarget)} onClose={saving ? undefined : () => setDeleteTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle>Eliminar vacante</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Esta accion eliminara la vacante "{deleteTarget?.title}". Puedes cancelar si solo querias cerrarla.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button variant="outlined" color="secondary" onClick={() => setDeleteTarget(null)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="contained" color="error" startIcon={saving ? <CircularProgress color="inherit" size={18} /> : <DeleteOutlineIcon />} onClick={handleDelete} disabled={saving}>
            {saving ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ActionResultDialog
        open={Boolean(resultDialog)}
        onClose={() => setResultDialog(null)}
        title={resultDialog?.title}
        description={resultDialog?.description}
        type={resultDialog?.type}
      />
    </>
  );
}

function KpiCard({ title, value, icon, tone }) {
  const isPrimary = tone === 'primary';
  const isSuccess = tone === 'success';

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          bgcolor: isPrimary ? 'primary.light' : isSuccess ? 'success.light' : 'grey.50',
          color: isPrimary ? 'primary.800' : isSuccess ? 'success.dark' : 'grey.800',
          borderRadius: 3,
          border: '1px solid',
          borderColor: isPrimary ? 'primary.200' : isSuccess ? 'success.200' : 'grey.200',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={600} color={isPrimary ? 'primary.dark' : isSuccess ? 'success.dark' : 'text.secondary'}>
            {title}
          </Typography>
          <Typography variant="h2" fontWeight={700} sx={{ mt: 1 }}>
            {value}
          </Typography>
        </Box>
        {icon}
      </Paper>
    </Grid>
  );
}

function Divider({ sx }) {
  return <Box sx={{ width: '100%', height: '1px', bgcolor: 'grey.200', ...sx }} />;
}