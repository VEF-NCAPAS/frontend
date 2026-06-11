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

import ActionResultDialog from '../components/ActionResultDialog';
import PageHeading from '../components/PageHeading';
import { buttonSX } from '../data/candidateData';

import { IconBriefcase, IconDeviceFloppy, IconDownload, IconPlus, IconSchool, IconTrash, IconX } from '@tabler/icons-react';

const skillOptions = {
  'Tecnología y desarrollo': [
    'JavaScript',
    'React',
    'TypeScript',
    'Node.js',
    'Python',
    'SQL',
    'Git',
    'Desarrollo web',
    'Soporte técnico',
    'HTML',
    'CSS',
    'Next.js',
    'Vue.js',
    'Angular',
    'Java',
    'C#',
    'PHP',
    'Docker',
    'AWS',
    'Bases de datos',
    'Pruebas de software',
    'Metodologías ágiles'
  ],
  'Diseño y creatividad': [
    'Figma',
    'Diseño UX/UI',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Diseño gráfico',
    'Investigación UX',
    'Branding',
    'Canva',
    'Diseño editorial',
    'Fotografía',
    'Edición de video',
    'Prototipado',
    'Ilustración digital'
  ],
  'Administración y finanzas': [
    'Excel',
    'Contabilidad',
    'Análisis financiero',
    'Facturación',
    'Presupuestos',
    'SAP',
    'Auditoría',
    'Power BI',
    'Nómina',
    'Gestión administrativa',
    'Compras',
    'Inventarios',
    'Atención al cliente'
  ],
  'Marketing y ventas': [
    'Ventas',
    'Marketing digital',
    'SEO',
    'Redes sociales',
    'Google Analytics',
    'Negociación',
    'Servicio al cliente',
    'Publicidad',
    'Email marketing',
    'Creación de contenido',
    'Copywriting',
    'CRM',
    'Investigación de mercado'
  ],
  'Ingeniería y operaciones': [
    'Gestión de proyectos',
    'AutoCAD',
    'Control de calidad',
    'Logística',
    'Procesos',
    'Seguridad industrial',
    'Lean Manufacturing',
    'Mantenimiento',
    'Planificación',
    'Gestión de proveedores',
    'Mejora continua'
  ],
  'Educación y salud': [
    'Docencia',
    'Planificación educativa',
    'Atención al paciente',
    'Primeros auxilios',
    'Investigación',
    'Trabajo en equipo',
    'Comunicación asertiva',
    'Liderazgo',
    'Resolución de problemas',
    'Organización',
    'Gestión del tiempo'
  ]
};

const actionButtonSX = {
  ...buttonSX,
  border: 0,
  boxShadow: 'none',
  fontWeight: 600,
  '&:hover': { border: 0, boxShadow: 'none' }
};

const skillChipSX = {
  bgcolor: '#eee8ff',
  borderColor: '#b7a3f5',
  color: '#5b3fa3',
  '& .MuiChip-deleteIcon': { color: '#8066c9' }
};

const institutionOptions = [
  'Universidad Centroamericana José Simeón Cañas',
  'Universidad de El Salvador',
  'Universidad Don Bosco',
  'Universidad Tecnológica de El Salvador',
  'Instituto Técnico de Exalumnos Salesianos ITEXSAL'
];

const languageOptions = ['Español', 'Inglés', 'Francés', 'Portugués', 'Italiano', 'Alemán', 'Mandarín', 'Japonés', 'Coreano'];
const languageLevelOptions = [
  'A1 - Básico',
  'A2 - Elemental',
  'B1 - Intermedio',
  'B2 - Intermedio alto',
  'C1 - Avanzado',
  'C2 - Experto',
  'Nativo'
];
const currentYear = new Date().getFullYear();
const educationYearOptions = Array.from({ length: currentYear - 1949 }, (_, index) => String(currentYear - index));

const emptyExperience = { position: '', company: '', startDate: '', endDate: '', description: '' };
const emptyEducation = { institution: '', degree: '', startDate: '', endDate: '' };
const emptyLanguage = { language: '', level: '' };

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
  email: '',
  headline: 'Desarrolladora Frontend',
  summary: '',
  country: 'El Salvador',
  city: 'San Salvador, San Salvador',
  careerArea: 'Tecnología y desarrollo',
  skills: ['JavaScript', 'React'],
  experiences: [{ ...emptyExperience }],
  education: [{ ...emptyEducation }],
  languages: [{ language: 'Español', level: 'Nativo' }]
};

const normalizeResume = (resume) => ({
  ...defaultResume,
  ...resume,
  experiences: resume.experiences || defaultResume.experiences,
  education: resume.education || defaultResume.education,
  languages: resume.languages || defaultResume.languages
});

export default function CandidateResumePage() {
  const { state: storedResume, setState: setStoredResume } = useLocalStorage('candidate-digital-resume', defaultResume);
  const [resume, setResume] = useState(() => normalizeResume(storedResume));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [resultDialog, setResultDialog] = useState(null);

  const suggestedSkills = useMemo(() => skillOptions[resume.careerArea] || [], [resume.careerArea]);
  const fullName = [resume.firstName, resume.lastName].filter(Boolean).join(' ');

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
    if (!resume.email.trim()) {
      validationErrors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.email)) {
      validationErrors.email = 'Ingresa un correo electrónico válido.';
    }
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
    setMessage(null);
    setResultDialog({
      title: 'CV guardado',
      description: 'Tu CV digital fue guardado correctamente.',
      type: 'success'
    });
  };

  const handleCancel = () => {
    setResume(normalizeResume(storedResume));
    setErrors({});
    setMessage(null);
    setResultDialog({
      title: 'Cambios cancelados',
      description: 'Los cambios sin guardar fueron cancelados correctamente.',
      type: 'cancel'
    });
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
          <article class="experience-item">
            <p><strong>${escapeHtml(item.position || 'Puesto')}${item.company ? `, ${escapeHtml(item.company)}` : ''}</strong>${item.startDate || item.endDate ? `, ${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(' - '))}` : ''}</p>
            ${item.description ? `<ul><li>${escapeHtml(item.description)}</li></ul>` : ''}
          </article>
        `
      )
      .join('');
    const printableEducation = resume.education
      .filter((item) => item.institution || item.degree)
      .map(
        (item) => `
          <article class="education-item">
            <p class="education-title">${escapeHtml(item.degree || 'Título académico')} <span>${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(' - '))}</span></p>
            <p><strong>${escapeHtml(item.institution)}</strong></p>
          </article>
        `
      )
      .join('');
    const printableLanguages = resume.languages
      .filter((item) => item.language || item.level)
      .map((item) => `<li>${escapeHtml([item.language, item.level].filter(Boolean).join(', '))}</li>`)
      .join('');
    const initials = [resume.firstName, resume.lastName]
      .filter(Boolean)
      .map((name) => name.trim().charAt(0).toUpperCase())
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
            * { box-sizing: border-box; }
            body { background: #111; color: #242424; font-family: Georgia, 'Times New Roman', serif; font-size: 14px; line-height: 1.35; margin: 0; }
            .resume { background: #fff; margin: 20px auto; max-width: 790px; min-height: 1080px; padding: 54px 48px; }
            .header { align-items: center; display: grid; gap: 24px; grid-template-columns: 68px 1fr 220px; margin-bottom: 28px; }
            .initials { align-items: center; background: #4d747d; color: #fff; display: flex; font-size: 18px; height: 64px; justify-content: center; letter-spacing: 2px; width: 64px; }
            .header h1 { color: #4d747d; font-size: 29px; font-weight: 500; letter-spacing: 7px; line-height: 1.2; margin: 0; text-transform: uppercase; }
            .contact { font-size: 13px; line-height: 1.65; }
            .section { margin-bottom: 25px; }
            h2 { border-bottom: 1.5px solid #242424; color: #4d747d; font-size: 16px; letter-spacing: 2px; margin: 0 0 11px; padding-bottom: 5px; text-transform: uppercase; }
            p { margin: 0; }
            ul { margin: 6px 0 0; padding-left: 20px; }
            li { margin-bottom: 4px; }
            .skills { columns: 2; column-gap: 42px; }
            .skills li { break-inside: avoid; }
            .education-item, .experience-item { margin-bottom: 13px; }
            .education-title { display: flex; justify-content: space-between; }
            .education-item strong, .experience-item strong { letter-spacing: 1px; }
            .empty { color: #777; font-style: italic; }
            @page { margin: 0; size: A4; }
            @media print { body { background: #fff; } .resume { margin: 0; max-width: none; min-height: 100vh; } }
          </style>
        </head>
        <body>
          <div class="resume">
            <header class="header">
              <div class="initials">${escapeHtml(initials)}</div>
              <h1>${escapeHtml(fullName)}</h1>
              <div class="contact">
                <p>${escapeHtml(resume.email)}</p>
                <p>${escapeHtml(resume.city)}</p>
                <p>${escapeHtml(resume.country)}</p>
              </div>
            </header>
            <section class="section">
              <h2>Resumen profesional</h2>
              <p>${escapeHtml(resume.summary || `${resume.headline}. Profesional de ${resume.careerArea} con interés en seguir desarrollando sus habilidades y experiencia.`)}</p>
            </section>
            <section class="section">
              <h2>Aptitudes</h2>
              <ul class="skills">${resume.skills.map((skill) => `<li>${escapeHtml(skill)}</li>`).join('')}</ul>
            </section>
            <section class="section">
              <h2>Formación académica</h2>
              ${printableEducation || '<p class="empty">Sin educación agregada.</p>'}
            </section>
            <section class="section">
              <h2>Idiomas</h2>
              <ul>${printableLanguages || '<li class="empty">Sin idiomas agregados.</li>'}</ul>
            </section>
            <section class="section">
              <h2>Experiencia</h2>
              ${printableExperiences || '<p class="empty">Sin experiencia laboral agregada.</p>'}
            </section>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    setMessage(null);
    setResultDialog({
      title: 'CV exportado',
      description: 'Tu CV fue preparado correctamente para exportarlo en PDF.',
      type: 'info'
    });
  };

  return (
    <>
      <PageHeading
        title="CV / Hoja de vida"
        description="Crea tu CV digital con tu experiencia, educación y habilidades profesionales."
        action={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button
              variant="contained"
              startIcon={<IconDeviceFloppy size={18} />}
              sx={{ ...actionButtonSX, bgcolor: '#bde9f7', color: '#15576b', '&:hover': { bgcolor: '#a8deef' } }}
              onClick={handleSave}
            >
              Guardar CV
            </Button>
            <Button
              variant="contained"
              startIcon={<IconX size={18} />}
              sx={{ ...actionButtonSX, bgcolor: '#ffd6d6', color: '#9b3030', '&:hover': { bgcolor: '#ffc4c4' } }}
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              startIcon={<IconDownload size={18} />}
              sx={{ ...actionButtonSX, bgcolor: '#ded3ff', color: '#55359b', '&:hover': { bgcolor: '#cfc0fa' } }}
              onClick={handleExport}
            >
              Exportar CV en PDF
            </Button>
          </Stack>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
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
                      required
                      type="email"
                      label="Correo electrónico"
                      placeholder="nombre@correo.com"
                      value={resume.email}
                      onChange={handleFieldChange('email')}
                      error={Boolean(errors.email)}
                      helperText={errors.email}
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
                        type="date"
                        label="Fecha de inicio"
                        value={experience.startDate}
                        onChange={(event) => handleListChange('experiences', index, 'startDate', event.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        type="date"
                        label="Fecha de finalización"
                        value={experience.endDate}
                        onChange={(event) => handleListChange('experiences', index, 'endDate', event.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
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
                        select
                        fullWidth
                        label="Inicio"
                        value={education.startDate}
                        onChange={(event) => handleListChange('education', index, 'startDate', event.target.value)}
                      >
                        {educationYearOptions.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 3 }}>
                      <TextField
                        select
                        fullWidth
                        label="Finalización"
                        value={education.endDate}
                        onChange={(event) => handleListChange('education', index, 'endDate', event.target.value)}
                      >
                        {educationYearOptions.map((year) => (
                          <MenuItem key={year} value={year}>
                            {year}
                          </MenuItem>
                        ))}
                      </TextField>
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

            <MainCard
              title="Idiomas"
              border
              secondary={
                <Button
                  color="secondary"
                  startIcon={<IconPlus size={18} />}
                  sx={buttonSX}
                  onClick={() => addListItem('languages', emptyLanguage)}
                >
                  Añadir idioma
                </Button>
              }
            >
              <Stack spacing={3} divider={<Divider />}>
                {resume.languages.map((language, index) => (
                  <Grid container spacing={2} key={`language-${index}`}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Idioma"
                        value={language.language}
                        onChange={(event) => handleListChange('languages', index, 'language', event.target.value)}
                      >
                        {languageOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Nivel del idioma"
                        value={language.level}
                        onChange={(event) => handleListChange('languages', index, 'level', event.target.value)}
                      >
                        {languageLevelOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    {resume.languages.length > 1 && (
                      <Grid size={12}>
                        <Button
                          color="error"
                          startIcon={<IconTrash size={17} />}
                          sx={buttonSX}
                          onClick={() => removeListItem('languages', index)}
                        >
                          Eliminar idioma
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
                      <Chip label={option} variant="outlined" sx={skillChipSX} {...getItemProps({ index })} key={option} />
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
                {resume.email && (
                  <Typography variant="body2" color="text.secondary">
                    {resume.email}
                  </Typography>
                )}
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
                  Idiomas
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {resume.languages.some((item) => item.language || item.level) ? (
                    resume.languages.map(
                      (item, index) =>
                        (item.language || item.level) && (
                          <Chip
                            key={`preview-language-${index}`}
                            label={[item.language, item.level].filter(Boolean).join(' - ')}
                            size="small"
                            variant="outlined"
                            sx={skillChipSX}
                          />
                        )
                    )
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Añade los idiomas que dominas.
                    </Typography>
                  )}
                </Stack>
              </Box>

              <Divider />
              <Box>
                <Typography variant="h4" sx={{ mb: 1.25 }}>
                  Habilidades
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {resume.skills.length > 0 ? (
                    resume.skills.map((skill) => <Chip key={skill} label={skill} size="small" variant="outlined" sx={skillChipSX} />)
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
