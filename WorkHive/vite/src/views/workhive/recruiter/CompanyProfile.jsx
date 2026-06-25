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
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

// project imports
import MainCard from 'ui-component/cards/MainCard';

import {getMyCompany, updateCompany} from 'services/companyService';

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
        const response = await getMyCompany();
          setProfile(response.data);
          setFormData({
            name: response.data.companyName,
            location: response.data.location,
            sector: response.data.sector
          });
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
      await updateCompany(profile.id, formData);
      const companyResponse = await getMyCompany();
      setProfile(companyResponse.data);
      setFormData({
        name: companyResponse.data.companyName,
        location: companyResponse.data.location,
        sector: companyResponse.data.sector
      });
      setIsEditing(false);

      setSuccessMessage('Perfil de empresa actualizado exitosamente.');

    } catch (err) {
      console.error("Error saving profile", err);
    }

    // Clear message after 4s
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  const handleCancel = () => {
    setFormData({
      name: profile.companyName || '',
      location: profile.location || '',
      sector: profile.sector || ''
    });
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
                    {profile.companyName}
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
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" color="primary" fontWeight={600}>
                  Información Corporativa
                </Typography>
                
              </Box>

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
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  sx={{ borderRadius: 2 }}
                >
                  Registrar / Editar Perfil
                </Button>
              </Grid>
            </Grid>
          </Grid>

          
        ) : (
          // EDIT MODE FORM
          <form onSubmit={handleSave}>
            <Grid container spacing={3}>
  {/* Header */}
  <Grid item xs={12}>
    <Box mb={1}>
      <Typography variant="h4" color="primary" fontWeight={700}>
        Editar perfil de empresa
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Completa los siguientes campos para actualizar la información de tu empresa.
      </Typography>
    </Box>
  </Grid>

  {/* Form fields */}
  <Grid item xs={12}>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
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
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: '#9e9e9e' }}>Selecciona un sector</span>;
            }
            return selected;
          }}
        >
          <MenuItem value="" disabled>
            Selecciona un sector
          </MenuItem>

          {SECTORS.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>

      

      <Grid item xs={12} md={6}>
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
      
    </Grid>
  </Grid>

  

  {/* Buttons */}
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
