import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// assets
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SendIcon from '@mui/icons-material/Send';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ActionResultDialog from '../candidate/components/ActionResultDialog';
import { getAllRequirements } from 'services/requirementService';
import { createVacancy } from 'services/vacancyService';

const MODALITIES = [
  { value: 'REMOTE', label: 'Remoto' },
  { value: 'HYBRID', label: 'Hibrido' },
  { value: 'ONSITE', label: 'Presencial' }
];

const getResponsePayload = (response) => response?.data ?? response;

const normalizeRequirements = (response) => {
  const payload = getResponsePayload(response);
  const requirements = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.content)
    ? payload.content
    : Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload?.data?.content)
    ? payload.data.content
    : [];

  return requirements.filter((requirement) => requirement?.id);
};

const getRequirementLabel = (requirement) => requirement.name || requirement.title || requirement.description || requirement.id;

export default function PublishJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    salary: '',
    modality: 'REMOTE',
    description: ''
  });

  const [availableRequirements, setAvailableRequirements] = useState([]);
  const [selectedRequirements, setSelectedRequirements] = useState([]);
  const [errors, setErrors] = useState({});
  const [loadingRequirements, setLoadingRequirements] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resultDialog, setResultDialog] = useState(null);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    const loadRequirements = async () => {
      setLoadingRequirements(true);

      try {
        const response = await getAllRequirements();
        setAvailableRequirements(normalizeRequirements(response));
      } catch (error) {
        console.error('Error loading requirements:', error);
        setResultDialog({
          title: 'No se cargaron los requisitos',
          description: 'Revisa que el backend este activo y vuelve a intentarlo.',
          type: 'cancel'
        });
      } finally {
        setLoadingRequirements(false);
      }
    };

    loadRequirements();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    const validationErrors = {};
    const salary = Number(formData.salary);

    if (!formData.title.trim()) validationErrors.title = 'Ingresa el titulo de la vacante.';
    if (!formData.description.trim()) validationErrors.description = 'Ingresa la descripcion de la vacante.';
    if (!formData.salary || Number.isNaN(salary) || salary <= 0) validationErrors.salary = 'Ingresa un salario numerico mayor a cero.';
    if (!formData.modality) validationErrors.modality = 'Selecciona una modalidad.';
    if (selectedRequirements.length === 0) validationErrors.requirements = 'Selecciona al menos un requisito.';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      salary: Number(formData.salary),
      modality: formData.modality,
      status: 'OPEN',
      requirements: selectedRequirements.map((requirement) => ({ id: requirement.id }))
    };

    setSubmitting(true);

    try {
      await createVacancy(payload);
      setCreated(true);
      setResultDialog({
        title: 'Vacante publicada',
        description: 'La vacante fue creada correctamente y ya puede aparecer en tus ofertas.',
        type: 'success'
      });
    } catch (error) {
      console.error('Error creating vacancy:', error);
      setResultDialog({
        title: 'No se pudo publicar',
        description: error?.response?.data?.message || 'Revisa los datos de la vacante e intenta nuevamente.',
        type: 'cancel'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResultClose = () => {
    setResultDialog(null);
    if (created) {
      navigate('/reclutador/mis-ofertas');
    }
  };

  return (
    <>
      <MainCard title="Crear y Publicar Oferta de Empleo">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }
              }}
            >
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography variant="h4" color="primary" fontWeight={600} mb={1}>
                  Nueva Oferta Laboral
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingresa los detalles tecnicos, compensacion y requisitos clave para publicar la vacante.
                </Typography>
              </Box>

              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField
                  fullWidth
                  required
                  label="Titulo de la Vacante"
                  name="title"
                  placeholder="Ej: Desarrollador Backend Senior"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={Boolean(errors.title)}
                  helperText={errors.title}
                />
              </Box>

              <Box>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Salario"
                  name="salary"
                  placeholder="Ej: 3500"
                  value={formData.salary}
                  onChange={handleInputChange}
                  error={Boolean(errors.salary)}
                  helperText={errors.salary || 'Ingresa solo el monto numerico del salario para tu vacante.'}
                  inputProps={{ min: 0, step: '0.01' }}
                />
              </Box>

              <Box>
                <FormControl fullWidth required error={Boolean(errors.modality)}>
                  <InputLabel id="modality-select-label">Modalidad</InputLabel>
                  <Select
                    labelId="modality-select-label"
                    label="Modalidad"
                    name="modality"
                    value={formData.modality}
                    onChange={handleInputChange}
                  >
                    {MODALITIES.map((modality) => (
                      <MenuItem key={modality.value} value={modality.value}>
                        {modality.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.modality && <FormHelperText>{errors.modality}</FormHelperText>}
                </FormControl>
              </Box>

              <Box sx={{ gridColumn: '1 / -1' }}>
                <Autocomplete
                  multiple
                  loading={loadingRequirements}
                  options={availableRequirements}
                  getOptionLabel={getRequirementLabel}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={selectedRequirements}
                  onChange={(event, value) => {
                    setSelectedRequirements(value);
                    setErrors((prev) => ({ ...prev, requirements: undefined, submit: undefined }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Requisitos"
                      placeholder="Selecciona requisitos"
                      error={Boolean(errors.requirements)}
                      helperText={errors.requirements || 'Selecciona los requisitos de tu vacante.'}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingRequirements ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        )
                      }}
                    />
                  )}
                />
                <Box display="flex" flexWrap="wrap" gap={1} mt={1.5}>
                  {selectedRequirements.map((requirement) => (
                    <Chip key={requirement.id} label={getRequirementLabel(requirement)} color="primary" variant="outlined" />
                  ))}
                  {selectedRequirements.length === 0 && (
                    <Typography variant="caption" color="text.secondary">
                      * Aun no has seleccionado requisitos especificos.
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={6}
                  label="Descripcion Detallada de la Vacante"
                  name="description"
                  placeholder="Describe responsabilidades, cultura del equipo, beneficios y perfil ideal..."
                  value={formData.description}
                  onChange={handleInputChange}
                  error={Boolean(errors.description)}
                  helperText={errors.description}
                />
              </Box>

              <Box sx={{ gridColumn: '1 / -1' }}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate('/reclutador/mis-ofertas')}
                    sx={{ borderRadius: 2 }}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={submitting ? <CircularProgress color="inherit" size={18} /> : <SendIcon />}
                    sx={{ borderRadius: 2 }}
                    disabled={submitting || loadingRequirements}
                  >
                    {submitting ? 'Publicando...' : 'Publicar Oferta'}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200', borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box display="flex" alignItems="center" gap={1} color="primary.main">
                  <HelpOutlineIcon />
                  <Typography variant="h4" fontWeight={600}>
                    Guia de Publicacion
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    1. Requisitos
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                    Indique los requisitos que necesita para este puesto de trabajo.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    2. Modalidad
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                    Seleccione la modalidad que corresponde a esta vacante.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    3. Salario
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                   Indique un valor numerico, por ejemplo 3500.00.
                  </Typography>
                </Box>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                  <PostAddIcon color="action" sx={{ fontSize: 80, opacity: 0.15 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          </Grid>
        </form>
      </MainCard>

      <ActionResultDialog
        open={Boolean(resultDialog)}
        onClose={handleResultClose}
        title={resultDialog?.title}
        description={resultDialog?.description}
        type={resultDialog?.type}
      />
    </>
  );
}
