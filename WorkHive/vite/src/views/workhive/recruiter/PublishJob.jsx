import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormHelperText from '@mui/material/FormHelperText';

// assets
import PostAddIcon from '@mui/icons-material/PostAdd';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { recruiterService } from 'services/recruiterService';

const MODALITIES = ['Remoto', 'Híbrido', 'Presencial'];

export default function PublishJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    requirements: '',
    salary: '',
    modality: 'Remoto',
    keywords: '',
    description: ''
  });

  const [reqChips, setReqChips] = useState([]);
  const [keywordChips, setKeywordChips] = useState([]);
  const [currentReqInput, setCurrentReqInput] = useState('');
  const [currentKeyInput, setCurrentKeyInput] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Add Requirement Chip
  const handleAddRequirement = () => {
    if (currentReqInput.trim()) {
      const normalized = currentReqInput.trim();
      if (!reqChips.includes(normalized)) {
        const updated = [...reqChips, normalized];
        setReqChips(updated);
        setFormData((prev) => ({ ...prev, requirements: updated.join(', ') }));
      }
      setCurrentReqInput('');
    }
  };

  const handleRemoveRequirement = (chipToDelete) => {
    const updated = reqChips.filter((chip) => chip !== chipToDelete);
    setReqChips(updated);
    setFormData((prev) => ({ ...prev, requirements: updated.join(', ') }));
  };

  // Add Keyword Chip
  const handleAddKeyword = () => {
    if (currentKeyInput.trim()) {
      const normalized = currentKeyInput.trim();
      if (!keywordChips.includes(normalized)) {
        const updated = [...keywordChips, normalized];
        setKeywordChips(updated);
        setFormData((prev) => ({ ...prev, keywords: updated.join(', ') }));
      }
      setCurrentKeyInput('');
    }
  };

  const handleRemoveKeyword = (chipToDelete) => {
    const updated = keywordChips.filter((chip) => chip !== chipToDelete);
    setKeywordChips(updated);
    setFormData((prev) => ({ ...prev, keywords: updated.join(', ') }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Fallback if chips were not used but they just typed in text field
    const finalRequirements = formData.requirements || reqChips.join(', ');
    const finalKeywords = formData.keywords || keywordChips.join(', ');

    if (!formData.title || !formData.salary || !formData.description) {
      alert('Por favor completa los campos requeridos.');
      return;
    }

    const payload = {
      ...formData,
      requirements: finalRequirements || 'Habilidades generales',
      keywords: finalKeywords || formData.title
    };

    recruiterService.publishJob(payload);
    navigate('/reclutador/mis-ofertas');
  };

  return (
    <MainCard title="Crear y Publicar Oferta de Empleo">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h4" color="primary" fontWeight={600} mb={1}>
                  Nueva Oferta Laboral
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingresa los detalles técnicos, compensación y requisitos clave. Los candidatos serán evaluados automáticamente basados en las palabras clave que registres.
                </Typography>
              </Grid>

              {/* Job Title */}
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  required
                  label="Título de la Vacante"
                  name="title"
                  placeholder="Ej: Desarrollador Backend Senior"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Modality */}
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel id="modality-select-label">Modalidad</InputLabel>
                  <Select
                    labelId="modality-select-label"
                    label="Modalidad"
                    name="modality"
                    value={formData.modality}
                    onChange={handleInputChange}
                  >
                    {MODALITIES.map((mod) => (
                      <MenuItem key={mod} value={mod}>{mod}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Salary Range */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Salario / Rango Salarial"
                  name="salary"
                  placeholder="Ej: $1800 - $2200 o Negociable"
                  value={formData.salary}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Add Requirements (Skills Chips) */}
              <Grid item xs={12}>
                <Box>
                  <Stack direction="row" spacing={1} mb={1}>
                    <TextField
                      fullWidth
                      label="Requisitos / Habilidades técnicas (Ingresa uno a uno)"
                      placeholder="Ej: React, Python, Git, Docker"
                      value={currentReqInput}
                      onChange={(e) => setCurrentReqInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRequirement();
                        }
                      }}
                    />
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={handleAddRequirement}
                      sx={{ px: 3 }}
                    >
                      Agregar
                    </Button>
                  </Stack>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1.5}>
                    {reqChips.map((chip) => (
                      <Chip
                        key={chip}
                        label={chip}
                        onDelete={() => handleRemoveRequirement(chip)}
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                    {reqChips.length === 0 && (
                      <Typography variant="caption" color="text.secondary">
                        * Aún no has agregado requisitos específicos.
                      </Typography>
                    )}
                  </Box>
                  <FormHelperText>Estas son las habilidades técnicas requeridas para el puesto y que aparecerán descritas en la vacante.</FormHelperText>
                </Box>
              </Grid>

              {/* Add Scoring Keywords (Skills Chips) */}
              <Grid item xs={12}>
                <Box>
                  <Stack direction="row" spacing={1} mb={1}>
                    <TextField
                      fullWidth
                      label="Palabras clave para evaluación (Keywords para Scoring automático)"
                      placeholder="Ej: React, JavaScript, SQL"
                      value={currentKeyInput}
                      onChange={(e) => setCurrentKeyInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddKeyword();
                        }
                      }}
                    />
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      onClick={handleAddKeyword}
                      sx={{ px: 3 }}
                    >
                      Agregar
                    </Button>
                  </Stack>
                  <Box display="flex" flexWrap="wrap" gap={1} mt={1.5}>
                    {keywordChips.map((chip) => (
                      <Chip
                        key={chip}
                        label={chip}
                        onDelete={() => handleRemoveKeyword(chip)}
                        color="success"
                        variant="filled"
                        sx={{ color: '#fff', fontWeight: 500 }}
                      />
                    ))}
                    {keywordChips.length === 0 && (
                      <Typography variant="caption" color="text.secondary">
                        * Aún no has agregado palabras clave para el Score.
                      </Typography>
                    )}
                  </Box>
                  <FormHelperText>¡Muy Importante! El sistema buscará coincidencia exacta de estas palabras clave en las habilidades del candidato para calcular su puntuación final (Matching Score).</FormHelperText>
                </Box>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={6}
                  label="Descripción Detallada de la Vacante"
                  name="description"
                  placeholder="Describe detalladamente las responsabilidades del puesto, la cultura del equipo, beneficios adicionales y perfil general del candidato ideal..."
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate('/reclutador/mis-ofertas')}
                    sx={{ borderRadius: 2 }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SendIcon />}
                    sx={{ borderRadius: 2 }}
                  >
                    Publicar Oferta
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Grid>

          {/* Guidelines Sidebar */}
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'grey.50', border: '1px solid', borderColor: 'grey.200', borderRadius: 3, height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box display="flex" alignItems="center" gap={1} color="primary.main">
                  <HelpOutlineIcon />
                  <Typography variant="h4" fontWeight={600}>
                    Guía de Publicación
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    1. Requisitos vs Palabras Clave
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                    Los **Requisitos** se visualizan públicamente para los candidatos. Las **Palabras Clave** se utilizan para la lógica interna de la plataforma para ordenar a los candidatos de acuerdo a su nivel de afinidad con el perfil técnico.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    2. Modalidad y Ubicación
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                    Selecciona **Remoto** si tu vacante aplica para teletrabajo a nivel nacional o internacional, **Híbrido** si requiere algunos días presenciales, o **Presencial** para trabajo formal de oficina.
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                    3. Rango Salarial Transparente
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                    Las vacantes que publican un rango salarial transparente reciben hasta un **40% más de postulaciones** de calidad de candidatos calificados.
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
  );
}
