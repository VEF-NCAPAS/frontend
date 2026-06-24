import { useState, useEffect } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

// assets
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { recruiterService } from 'services/recruiterService';

// sectors list
const SECTORS = [
  'Tecnología de la Información',
  'Banca y Finanzas',
  'Salud y Farmacéutica',
  'Educación',
  'Manufactura y Producción',
  'Consumo Masivo',
  'Servicios Profesionales',
  'Telecomunicaciones'
];

// sizes list
const COMPANY_SIZES = [
  '1 - 10 empleados',
  '11 - 50 empleados',
  '50 - 200 empleados',
  '201 - 500 empleados',
  '500+ empleados'
];

export default function CompanyProfile() {
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await recruiterService.getCompanyProfile();
        setProfile(data);
        setFormData(data);
      } catch (err) {
        console.error("Error loading profile", err);
      }
    };
    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await recruiterService.updateCompanyProfile(formData);
      setProfile(updated);
      setIsEditing(false);
      setSuccessMessage('¡Perfil de la empresa registrado y actualizado correctamente!');
    } catch (err) {
      console.error("Error saving profile", err);
    }

    // Clear message after 4s
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <MainCard title="Perfil de Empresa">
      <Stack spacing={3}>
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {!isEditing ? (
          // VIEW MODE
          <Grid container spacing={4}>
            {/* Header info / Logo placeholder */}
            <Grid item xs={12} md={4}>
              <Card sx={{
                background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
                color: '#fff',
                textAlign: 'center',
                py: 5,
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(21, 101, 192, 0.2)'
              }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <Box sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    p: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <BusinessIcon sx={{ fontSize: 60 }} />
                  </Box>
                  <Typography variant="h3" sx={{ color: '#fff', fontWeight: 600 }}>
                    {profile.name}
                  </Typography>
                  <Chip
                    label={profile.sector}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.25)',
                      color: '#fff',
                      fontWeight: 500,
                      backdropFilter: 'blur(4px)'
                    }}
                  />
                  <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2">{profile.location}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Profile detail */}
            <Grid item xs={12} md={8}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" color="primary" fontWeight={600}>
                  Información Corporativa
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Registrar / Editar Perfil
                </Button>
              </Box>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, color: 'text.secondary' }}>
                {profile.description || 'Sin descripción todavía. Haz clic en Editar Perfil para registrar una descripción.'}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <LocationOnIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Ubicación</Typography>
                      <Typography variant="body2" fontWeight={500}>{profile.location}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <BusinessIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Sector Industrial</Typography>
                      <Typography variant="body2" fontWeight={500}>{profile.sector}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <LanguageIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Sitio Web</Typography>
                      <Typography variant="body2" fontWeight={500} component="a" href={profile.website} target="_blank" rel="noreferrer" sx={{ textDecoration: 'none', color: 'primary.main' }}>
                        {profile.website}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <MailOutlineIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Email de Contacto</Typography>
                      <Typography variant="body2" fontWeight={500}>{profile.email}</Typography>
                    </Box>
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <BusinessIcon color="action" />
                    <Box>
                      <Typography variant="caption" color="text.secondary">Tamaño / Fundación</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {profile.employees} (Fundada en {profile.founded})
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          // EDIT MODE FORM
          <form onSubmit={handleSave}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h4" color="primary" fontWeight={600} mb={1}>
                  Registrar Información de la Empresa
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Completa los siguientes campos para registrar y publicar la información pública de tu empresa.
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre de la Empresa"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="sector-select-label">Sector Industrial</InputLabel>
                  <Select
                    labelId="sector-select-label"
                    label="Sector Industrial"
                    name="sector"
                    value={formData.sector || ''}
                    onChange={handleInputChange}
                  >
                    {SECTORS.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Ubicación"
                  name="location"
                  placeholder="Ej: San Salvador, El Salvador"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel id="size-select-label">Tamaño de la Empresa</InputLabel>
                  <Select
                    labelId="size-select-label"
                    label="Tamaño de la Empresa"
                    name="employees"
                    value={formData.employees || ''}
                    onChange={handleInputChange}
                  >
                    {COMPANY_SIZES.map((sz) => (
                      <MenuItem key={sz} value={sz}>{sz}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Sitio Web"
                  name="website"
                  placeholder="Ej: https://miempresa.com"
                  value={formData.website || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Email de Contacto"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </Grid>


              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Año de Fundación"
                  name="founded"
                  type="number"
                  placeholder="Ej: 2018"
                  value={formData.founded || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Descripción de la Empresa"
                  name="description"
                  placeholder="Escribe una breve reseña sobre la empresa, cultura, misión y qué hacen..."
                  value={formData.description || ''}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{ borderRadius: 2 }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Guardar Perfil
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        )}
      </Stack>
    </MainCard>
  );
}
