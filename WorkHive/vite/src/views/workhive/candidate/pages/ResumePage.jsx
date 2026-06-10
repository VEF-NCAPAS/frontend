import { useMemo, useState } from 'react';

import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useLocalStorage } from 'hooks/useLocalStorage';
import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import { buttonSX } from '../data/candidateData';

import { IconBriefcase, IconDeviceFloppy, IconDownload, IconPlus, IconSchool, IconTrash, IconX } from '@tabler/icons-react';

const skillOptions = {
  'Tecnología y desarrollo': ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Git', 'Desarrollo web', 'Soporte técnico'],
  'Diseño y creatividad': [
    'Figma',
    'Diseño UX/UI',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Diseño gráfico',
    'Investigación UX',
    'Branding'
  ],
  'Administración y finanzas': ['Excel', 'Contabilidad', 'Análisis financiero', 'Facturación', 'Presupuestos', 'SAP', 'Auditoría'],
  'Marketing y ventas': ['Ventas', 'Marketing digital', 'SEO', 'Redes sociales', 'Google Analytics', 'Negociación', 'Servicio al cliente'],
  'Ingeniería y operaciones': ['Gestión de proyectos', 'AutoCAD', 'Control de calidad', 'Logística', 'Procesos', 'Seguridad industrial'],
  'Educación y salud': [
    'Docencia',
    'Planificación educativa',
    'Atención al paciente',
    'Primeros auxilios',
    'Investigación',
    'Trabajo en equipo'
  ]
};

const institutionOptions = [
  'Universidad Centroamericana José Simeón Cañas',
  'Universidad de El Salvador',
  'Universidad Don Bosco',
  'Universidad Tecnológica de El Salvador',
  'Instituto Técnico de Exalumnos Salesianos ITEXSAL'
];

const emptyExperience = { position: '', company: '', startDate: '', endDate: '', description: '' };
const emptyEducation = { institution: '', degree: '', startDate: '', endDate: '' };

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const defaultResume = {
  firstName: 'Ana',
  lastName: 'Martínez',
  complementaryName: '',
  headline: 'Desarrolladora Frontend',
  summary: '',
  country: 'El Salvador',
  city: 'San Salvador, San Salvador',
  careerArea: 'Tecnología y desarrollo',
  skills: ['JavaScript', 'React'],
  experiences: [{ ...emptyExperience }],
  education: [{ ...emptyEducation }]
};

export default function CandidateResumePage() {
  const { state: storedResume, setState: setStoredResume } = useLocalStorage('candidate-digital-resume', defaultResume);
  const [resume, setResume] = useState(storedResume);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);

  const suggestedSkills = useMemo(() => skillOptions[resume.careerArea] || [], [resume.careerArea]);
  const fullName = [resume.firstName, resume.complementaryName, resume.lastName].filter(Boolean).join(' ');

  const handleFieldChange = (field) => (event) => {
    setResume((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setMessage(null);
  };

  const handleCareerAreaChange = (event) => {
    const careerArea = event.target.value;
    const allowedSkills = skillOptions[careerArea];

    setResume((previous) => ({
      ...previous,
      careerArea,
      skills: previous.skills.filter((skill) => allowedSkills.includes(skill))
    }));
    setMessage(null);
  };

  const handleListChange = (section, index, field, value) => {
    setResume((previous) => ({
      ...previous,
      [section]: previous[section].map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    }));
    setMessage(null);
  };

  const addListItem = (section, emptyItem) => {
    setResume((previous) => ({ ...previous, [section]: [...previous[section], { ...emptyItem }] }));
  };

  const removeListItem = (section, index) => {
    setResume((previous) => ({ ...previous, [section]: previous[section].filter((item, itemIndex) => itemIndex !== index) }));
  };

  const validate = () => {
    const validationErrors = {};

    if (!resume.firstName.trim()) validationErrors.firstName = 'El nombre es obligatorio.';
    if (!resume.lastName.trim()) validationErrors.lastName = 'Los apellidos son obligatorios.';
    if (!resume.headline.trim()) validationErrors.headline = 'El puesto o título profesional es obligatorio.';
    if (!resume.country.trim()) validationErrors.country = 'El país es obligatorio.';
    if (!resume.careerArea) validationErrors.careerArea = 'Selecciona un área profesional.';
    if (resume.skills.length === 0) validationErrors.skills = 'Selecciona al menos una habilidad.';

    return validationErrors;
  };

  const handleSave = () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage({ type: 'error', text: 'Completa los campos obligatorios para guardar tu CV digital.' });
      return;
    }

    setStoredResume(resume);
    setErrors({});
    setMessage({ type: 'success', text: 'CV digital guardado correctamente.' });
  };

  const handleCancel = () => {
    setResume(storedResume);
    setErrors({});
    setMessage({ type: 'info', text: 'Los cambios sin guardar fueron cancelados.' });
  };

  const handleExport = () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage({ type: 'error', text: 'Completa los campos obligatorios antes de exportar tu CV en PDF.' });
      return;
    }

    const printableExperiences = resume.experiences
      .filter((item) => item.position || item.company)
      .map(
        (item) => `
          <section>
            <h3>${escapeHtml(item.position || 'Puesto')}</h3>
            <p>${escapeHtml([item.company, [item.startDate, item.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' | '))}</p>
            ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
          </section>
        `
      )
      .join('');
    const printableEducation = resume.education
      .filter((item) => item.institution || item.degree)
      .map(
        (item) => `
          <section>
            <h3>${escapeHtml(item.degree || 'Título académico')}</h3>
            <p>${escapeHtml([item.institution, [item.startDate, item.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' | '))}</p>
          </section>
        `
      )
      .join('');
    const printWindow = window.open('', '_blank', 'width=900,height=700');

    if (!printWindow) {
      setMessage({ type: 'error', text: 'No se pudo abrir la exportación. Habilita las ventanas emergentes e inténtalo de nuevo.' });
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html lang="es">
        <head>
          <title>CV - ${escapeHtml(fullName)}</title>
          <style>
            body { color: #263238; font-family: Arial, sans-serif; line-height: 1.5; margin: 40px auto; max-width: 800px; }
            h1 { color: #1565c0; margin-bottom: 0; }
            h2 { border-bottom: 2px solid #90caf9; color: #1565c0; margin-top: 28px; padding-bottom: 4px; }
            h3, p { margin: 4px 0; }
            .skills { display: flex; flex-wrap: wrap; gap: 8px; }
            .skill { background: #e3f2fd; border: 1px solid #64b5f6; border-radius: 16px; color: #0d47a1; padding: 4px 10px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(fullName)}</h1>
          <h3>${escapeHtml(resume.headline)}</h3>
          <p>${escapeHtml([resume.city, resume.country].filter(Boolean).join(', '))}</p>
          ${resume.summary ? `<h2>Perfil profesional</h2><p>${escapeHtml(resume.summary)}</p>` : ''}
          ${printableExperiences ? `<h2>Experiencia</h2>${printableExperiences}` : ''}
          ${printableEducation ? `<h2>Educación</h2>${printableEducation}` : ''}
          <h2>Habilidades</h2>
          <div class="skills">${resume.skills.map((skill) => `<span class="skill">${escapeHtml(skill)}</span>`).join('')}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setMessage({ type: 'success', text: 'CV preparado correctamente. Selecciona "Guardar como PDF" en la ventana de impresión.' });
  };

  const missingRequiredFields = Object.keys(validate()).length;

  return (
    <>
      <PageHeading
        title="CV / Hoja de vida"
        description="Crea tu CV digital con tu experiencia, educación y habilidades profesionales."
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="contained" color="secondary" startIcon={<IconDeviceFloppy size={18} />} sx={buttonSX} onClick={handleSave}>
              Guardar CV
            </Button>
            <Button variant="outlined" color="inherit" startIcon={<IconX size={18} />} sx={buttonSX} onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="outlined" color="info" startIcon={<IconDownload size={18} />} sx={buttonSX} onClick={handleExport}>
              Exportar CV en PDF
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <Alert severity={missingRequiredFields === 0 ? 'success' : 'warning'} variant="outlined">
              {missingRequiredFields === 0
                ? 'Perfil completo: la información obligatoria está lista para guardar o exportar.'
                : `Perfil incompleto: completa ${missingRequiredFields} campo${missingRequiredFields === 1 ? '' : 's'} obligatorio${missingRequiredFields === 1 ? '' : 's'}.`}
            </Alert>
            {message && <Alert severity={message.type}>{message.text}</Alert>}

            <MainCard title="Información personal" border>
              <Stack spacing={2.5}>
                <Typography variant="body2" color="text.secondary">
                  * El asterisco indica que el campo es obligatorio.
                </Typography>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Nombre"
                      value={resume.firstName}
                      onChange={handleFieldChange('firstName')}
                      error={Boolean(errors.firstName)}
                      helperText={errors.firstName}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Apellidos"
                      value={resume.lastName}
                      onChange={handleFieldChange('lastName')}
                      error={Boolean(errors.lastName)}
                      helperText={errors.lastName}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Nombre complementario"
                      value={resume.complementaryName}
                      onChange={handleFieldChange('complementaryName')}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      required
                      label="Puesto actual o título profesional"
                      placeholder="Ej. Desarrolladora Frontend"
                      value={resume.headline}
                      onChange={handleFieldChange('headline')}
                      error={Boolean(errors.headline)}
                      helperText={errors.headline}
                    />
                  </Grid>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Resumen profesional"
                      placeholder="Describe brevemente tu experiencia, fortalezas y objetivos."
                      value={resume.summary}
                      onChange={handleFieldChange('summary')}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </MainCard>

            <MainCard title="Ubicación" border>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="País o región"
                    value={resume.country}
                    onChange={handleFieldChange('country')}
                    error={Boolean(errors.country)}
                    helperText={errors.country}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Ciudad" value={resume.city} onChange={handleFieldChange('city')} />
                </Grid>
              </Grid>
            </MainCard>

            <MainCard
              title="Experiencia laboral"
              border
              secondary={
                <Button
                  color="secondary"
                  startIcon={<IconPlus size={18} />}
                  sx={buttonSX}
                  onClick={() => addListItem('experiences', emptyExperience)}
                >
                  Añadir puesto
                </Button>
              }
            >
              <Stack spacing={3} divider={<Divider />}>
                {resume.experiences.map((experience, index) => (
                  <Grid container spacing={2} key={`experience-${index}`}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Puesto"
                        placeholder="Ej. Desarrolladora Frontend"
                        value={experience.position}
                        onChange={(event) => handleListChange('experiences', index, 'position', event.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Empresa"
                        value={experience.company}
                        onChange={(event) => handleListChange('experiences', index, 'company', event.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Fecha de inicio"
                        placeholder="Ej. Enero 2024"
                        value={experience.startDate}
                        onChange={(event) => handleListChange('experiences', index, 'startDate', event.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Fecha de finalización"
                        placeholder="Ej. Actualidad"
                        value={experience.endDate}
                        onChange={(event) => handleListChange('experiences', index, 'endDate', event.target.value)}
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label="Funciones y logros"
                        value={experience.description}
                        onChange={(event) => handleListChange('experiences', index, 'description', event.target.value)}
                      />
                    </Grid>
                    {resume.experiences.length > 1 && (
                      <Grid size={12}>
                        <Button
                          color="error"
                          startIcon={<IconTrash size={17} />}
                          sx={buttonSX}
                          onClick={() => removeListItem('experiences', index)}
                        >
                          Eliminar puesto
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                ))}
              </Stack>
            </MainCard>

            <MainCard
              title="Educación"
              border
              secondary={
                <Button
                  color="secondary"
                  startIcon={<IconPlus size={18} />}
                  sx={buttonSX}
                  onClick={() => addListItem('education', emptyEducation)}
                >
                  Añadir educación
                </Button>
              }
            >
              <Stack spacing={3} divider={<Divider />}>
                {resume.education.map((education, index) => (
                  <Grid container spacing={2} key={`education-${index}`}>
                    <Grid size={12}>
                      <Autocomplete
                        freeSolo
                        options={institutionOptions}
                        value={education.institution}
                        onChange={(event, value) => handleListChange('education', index, 'institution', value || '')}
                        onInputChange={(event, value) => handleListChange('education', index, 'institution', value)}
                        renderInput={(params) => (
                          <TextField {...params} label="Institución educativa" placeholder="Selecciona o escribe una institución" />
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Título o carrera"
                        value={education.degree}
                        onChange={(event) => handleListChange('education', index, 'degree', event.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <TextField
                        fullWidth
                        label="Inicio"
                        value={education.startDate}
                        onChange={(event) => handleListChange('education', index, 'startDate', event.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <TextField
                        fullWidth
                        label="Finalización"
                        value={education.endDate}
                        onChange={(event) => handleListChange('education', index, 'endDate', event.target.value)}
                      />
                    </Grid>
                    {resume.education.length > 1 && (
                      <Grid size={12}>
                        <Button
                          color="error"
                          startIcon={<IconTrash size={17} />}
                          sx={buttonSX}
                          onClick={() => removeListItem('education', index)}
                        >
                          Eliminar educación
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                ))}
              </Stack>
            </MainCard>

            <MainCard title="Habilidades" border>
              <Stack spacing={2.5}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Área profesional o interés de carrera"
                  value={resume.careerArea}
                  onChange={handleCareerAreaChange}
                  error={Boolean(errors.careerArea)}
                  helperText={errors.careerArea || 'Las habilidades sugeridas cambiarán según el área seleccionada.'}
                >
                  {Object.keys(skillOptions).map((area) => (
                    <MenuItem key={area} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </TextField>
                <Autocomplete
                  multiple
                  options={suggestedSkills}
                  value={resume.skills}
                  onChange={(event, value) => {
                    setResume((previous) => ({ ...previous, skills: value }));
                    setErrors((previous) => ({ ...previous, skills: undefined }));
                    setMessage(null);
                  }}
                  renderValue={(value, getItemProps) =>
                    value.map((option, index) => (
                      <Chip label={option} color="info" variant="outlined" {...getItemProps({ index })} key={option} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Selecciona tus habilidades"
                      placeholder="Busca una habilidad"
                      error={Boolean(errors.skills)}
                      helperText={errors.skills || 'Selecciona las habilidades que mejor representen tu perfil.'}
                    />
                  )}
                />
              </Stack>
            </MainCard>

          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <MainCard title="Vista previa" border sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h2">{fullName || 'Tu nombre'}</Typography>
                <Typography variant="h4" color="secondary.main" sx={{ mt: 0.75 }}>
                  {resume.headline || 'Tu título profesional'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {[resume.city, resume.country].filter(Boolean).join(', ')}
                </Typography>
              </Box>

              {resume.summary && <Typography variant="body2">{resume.summary}</Typography>}
              <Divider />

              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconBriefcase size={19} />
                  <Typography variant="h4">Experiencia</Typography>
                </Stack>
                {resume.experiences.some((item) => item.position || item.company) ? (
                  resume.experiences.map(
                    (item, index) =>
                      (item.position || item.company) && (
                        <Box key={`preview-experience-${index}`}>
                          <Typography variant="subtitle1">{item.position || 'Puesto'}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {[item.company, [item.startDate, item.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' | ')}
                          </Typography>
                          {item.description && <Typography variant="body2">{item.description}</Typography>}
                        </Box>
                      )
                  )
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Añade tu experiencia laboral.
                  </Typography>
                )}
              </Stack>

              <Divider />
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconSchool size={19} />
                  <Typography variant="h4">Educación</Typography>
                </Stack>
                {resume.education.some((item) => item.institution || item.degree) ? (
                  resume.education.map(
                    (item, index) =>
                      (item.institution || item.degree) && (
                        <Box key={`preview-education-${index}`}>
                          <Typography variant="subtitle1">{item.degree || 'Título académico'}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {[item.institution, [item.startDate, item.endDate].filter(Boolean).join(' - ')].filter(Boolean).join(' | ')}
                          </Typography>
                        </Box>
                      )
                  )
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Añade tu formación académica.
                  </Typography>
                )}
              </Stack>

              <Divider />
              <Box>
                <Typography variant="h4" sx={{ mb: 1.25 }}>
                  Habilidades
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {resume.skills.length > 0 ? (
                    resume.skills.map((skill) => <Chip key={skill} label={skill} size="small" color="info" variant="outlined" />)
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Selecciona tus habilidades.
                    </Typography>
                  )}
                </Stack>
              </Box>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}
