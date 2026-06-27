import { useMemo, useState, useEffect } from 'react';

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

import { createCv, getCvByCandidate, updateCv } from 'services/cvService';
import { getAllSkills } from 'services/skillService';
import { getAllLanguages } from 'services/languageService';

import { IconBriefcase, IconDeviceFloppy, IconDownload, IconPlus, IconSchool, IconTrash, IconX } from '@tabler/icons-react';

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

const languageLevelOptions = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'NATIVE'];
const currentYear = new Date().getFullYear();
const educationYearOptions = Array.from({ length: currentYear - 1949 }, (_, index) => String(currentYear - index));

const emptyExperience = { position: '', company: '', startDate: '', endDate: '', description: '' };
const emptyEducation = { institution: '', major: '' };
const emptyLanguage = { id: '', level: '' };

const formatLanguageLevel = (level) => (level === 'NATIVE' ? 'Nativo' : level);

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const defaultResume = {
  name: '',
  email: '',
  headline: '',
  summary: '',
  location: '',
  city: '',
  skills: [],
  experiences: [{ ...emptyExperience }],
  education: [{ ...emptyEducation }],
  languages: [{ ...emptyLanguage }]
};

const normalizeResume = (resume) => ({
  ...defaultResume,
  ...resume,
  experiences: resume.experiences || defaultResume.experiences,
  education: resume.education || defaultResume.education,
  languages: resume.languages || defaultResume.languages
});

export default function CandidateResumePage() {
  const userName = localStorage.getItem('name');
  const userEmail = localStorage.getItem('email');
  const storageKey = userEmail ? `candidate-digital-resume-${userEmail}` : 'candidate-digital-resume';
  const { state: storedResume, setState: setStoredResume } = useLocalStorage(storageKey, defaultResume);
  const [resume, setResume] = useState(() => normalizeResume(storedResume));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [resultDialog, setResultDialog] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [cvId, setCvId] = useState(null);
  const [hasCv, setHasCv] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [originalResume, setOriginalResume] = useState(defaultResume);

  useEffect(() => {
    const loadData = async () => {
      try {
        const languagesResponse = await getAllLanguages();
        const languagePayload = languagesResponse?.data ?? languagesResponse;
        const languages = Array.isArray(languagePayload)
          ? languagePayload
          : Array.isArray(languagePayload?.data)
          ? languagePayload.data
          : [];
        setAvailableLanguages(languages);

        const skillsResponse = await getAllSkills();
        const skillPayload = skillsResponse?.data ?? skillsResponse;
        const skills = Array.isArray(skillPayload)
          ? skillPayload
          : Array.isArray(skillPayload?.data)
          ? skillPayload.data
          : [];
        setAvailableSkills(skills);

        const cvResponse = await getCvByCandidate();
        const cv = cvResponse?.data ?? cvResponse;
        const existingCv = Boolean(
          cv &&
            (cv.id || cv.name || cv.experiences?.length > 0 || cv.education?.length > 0 || cv.skills?.length > 0 || cv.languages?.length > 0)
        );
        setCvId(cv?.id ?? null);
        setHasCv(existingCv);
        setEditMode(!existingCv);

        const loadedResume = {
          name: cv.name || '',
          email: cv.email || '',
          headline: '',
          summary: cv.professionalSummary || cv.summary || '',
          location: cv.location || cv.country || 'El Salvador',
          city: cv.city || 'San Salvador',

          experiences:
            cv.experiences?.length > 0
              ? cv.experiences.map((exp) => ({
                company: exp.company || '',
                position: exp.position || '',
                description: exp.description || '',
                startDate: exp.hireDate || '',
                endDate: exp.endDate || ''
              }))
              : [{ ...emptyExperience }],

          education:
            cv.education?.length > 0
              ? cv.education.map((edu) => ({
                institution: edu.institution || '',
                major: edu.major || ''
              }))
              : [{ ...emptyEducation }],

          languages:
            cv.languages?.length > 0
              ? cv.languages.map((item) => ({
                id: item?.id,
                level: item?.level || '',
                name: item?.name || ''
              }))
              : [{ ...emptyLanguage }],

          skills:
            cv.skills
              ?.map((skillName) =>
                skills.find(
                  (skill) =>
                    String(skill.name).trim().toLowerCase() ===
                    String(skillName).trim().toLowerCase()
                )
              )
              .filter(Boolean) || []
        };

        setResume(loadedResume);
        setOriginalResume(loadedResume);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  const name = [resume.name].filter(Boolean).join(' ');
  const disableForm = hasCv && !editMode;

  const handleFieldChange = (field) => (event) => {
    setResume((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setMessage(null);
  };

  const handleLanguageSelectionChange = (index, languageId) => {
    const language = availableLanguages.find((item) => String(item.id) === String(languageId));
    setResume((previous) => ({
      ...previous,
      languages: previous.languages.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, id: languageId, name: language?.name || '' }
          : item
      )
    }));
    setErrors((previous) => ({ ...previous, languages: undefined }));
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


    if (!resume.location.trim()) validationErrors.location = 'El país o región es obligatorio.';
    if (resume.skills.length === 0) validationErrors.skills = 'Selecciona al menos una habilidad.';
    const validLanguages = resume.languages.filter((item) => item.id && item.level);
    if (validLanguages.length === 0) validationErrors.languages = 'Selecciona al menos un idioma y su nivel.';

    return validationErrors;
  };

  const handleSave = async () => {
    const validationErrors = validate();

    const validLanguages = resume.languages.filter((language) => language.id && language.level);
    const payload = {
      professionalSummary: resume.summary,
      location: resume.location,
      city: resume.city,
      experiences: resume.experiences
        .filter((exp) => exp.company || exp.position)
        .map((exp) => ({
          company: exp.company,
          position: exp.position,
          description: exp.description,
          hireDate: exp.startDate || null,
          endDate: exp.endDate || null
        })),

      education: resume.education
        .filter((edu) => edu.institution || edu.major)
        .map((edu) => ({
          institution: edu.institution,
          major: edu.major
        })),

      languages: validLanguages.map((language) => ({
        id: language.id,
        level: language.level
      })),

      skills: resume.skills.map((skill) =>
        typeof skill === 'object' ? { id: skill.id } : { id: skill }
      )
    };


    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setMessage({ type: 'error', text: 'Completa los campos obligatorios para guardar tu CV digital.' });
      return;
    }

    if (hasCv && cvId) {
      await updateCv(cvId, payload);
    } else {
      const createdCv = await createCv(payload);
      const createdId = createdCv?.data?.id ?? createdCv?.id;
      if (createdId) setCvId(createdId);
      setHasCv(true);
    }

    setOriginalResume(resume);
    setEditMode(false);
    setStoredResume(resume);
    setErrors({});
    setMessage(null);
    setResultDialog({
      title: hasCv ? 'CV actualizado' : 'CV guardado',
      description: 'Tu CV digital fue guardado correctamente.',
      type: 'success'
    });
  };

  const handleCancel = () => {
    setResume(originalResume);
    setErrors({});
    setMessage(null);
    setEditMode(hasCv);
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
      .filter((item) => item.institution || item.major)
      .map(
        (item) => `
          <article class="education-item">
            <p class="education-title">${escapeHtml(item.major || 'Título académico')} <span>${escapeHtml([item.startDate, item.endDate].filter(Boolean).join(' - '))}</span></p>
            <p><strong>${escapeHtml(item.institution)}</strong></p>
          </article>
        `
      )
      .join('');
    // Idiomas quemados
    const printableLanguages = resume.languages
      .filter((language) => language.name)
      .map((language) => `<li>${escapeHtml(language.name)}${language.level ? ` - ${escapeHtml(formatLanguageLevel(language.level))}` : ''}</li>`)
      .join('');
    const initials = (resume.name || '')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
    const printWindow = window.open('', '_blank', 'width=900,height=700');

    if (!printWindow) {
      setMessage({ type: 'error', text: 'No se pudo abrir la exportación. Habilita las ventanas emergentes e inténtalo de nuevo.' });
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html lang="es">
        <head>
          <title>CV - ${escapeHtml(resume.name)}</title>
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
              <h1>${escapeHtml(resume.name)}</h1>
              <div class="contact">
                <p>${escapeHtml(resume.email)}</p>
                <p>${escapeHtml([resume.city, resume.location].filter(Boolean).join(', '))}</p>
              </div>
            </header>
            <section class="section">
              <h2>Resumen profesional</h2>
              <p>${escapeHtml(resume.summary || 'Describe brevemente tu experiencia, fortalezas y objetivos.')}</p>
            </section>
            <section class="section">
              <h2>Aptitudes</h2>
              <ul class="skills">${resume.skills.map((skill) => `<li>${escapeHtml(skill.name)}</li>`).join('')}</ul>
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
            {hasCv && !editMode ? (
              <Button
                variant="contained"
                startIcon={<IconDeviceFloppy size={18} />}
                sx={{ ...actionButtonSX, bgcolor: '#bde9f7', color: '#15576b', '&:hover': { bgcolor: '#a8deef' } }}
                onClick={() => setEditMode(true)}
              >
                Actualizar CV
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<IconDeviceFloppy size={18} />}
                sx={{ ...actionButtonSX, bgcolor: '#bde9f7', color: '#15576b', '&:hover': { bgcolor: '#a8deef' } }}
                onClick={handleSave}
              >
                {hasCv ? 'Guardar cambios' : 'Guardar CV'}
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<IconX size={18} />}
              sx={{ ...actionButtonSX, bgcolor: '#ffd6d6', color: '#9b3030', '&:hover': { bgcolor: '#ffc4c4' } }}
              onClick={handleCancel}
              disabled={!editMode}
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
                    disabled={disableForm}
                  />
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
                    value={resume.location}
                    onChange={handleFieldChange('location')}
                    error={Boolean(errors.location)}
                    helperText={errors.location}
                    disabled={disableForm}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Ciudad" value={resume.city} onChange={handleFieldChange('city')} disabled={disableForm} />
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
                  disabled={disableForm}
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
                        disabled={disableForm}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Empresa"
                        value={experience.company}
                        onChange={(event) => handleListChange('experiences', index, 'company', event.target.value)}
                        disabled={disableForm}
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
                        disabled={disableForm}
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
                        disabled={disableForm}
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
                        disabled={disableForm}
                      />
                    </Grid>
                    {resume.experiences.length > 1 && (
                      <Grid size={12}>
                        <Button
                          color="error"
                          startIcon={<IconTrash size={17} />}
                          sx={buttonSX}
                          onClick={() => removeListItem('experiences', index)}
                          disabled={disableForm}
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
                  disabled={disableForm}
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
                        disabled={disableForm}
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
                        value={education.major}
                        onChange={(event) => handleListChange('education', index, 'major', event.target.value)}
                        disabled={disableForm}
                      />
                    </Grid>

                    {resume.education.length > 1 && (
                      <Grid size={12}>
                        <Button
                          color="error"
                          startIcon={<IconTrash size={17} />}
                          sx={buttonSX}
                          onClick={() => removeListItem('education', index)}
                          disabled={disableForm}
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
                  disabled={disableForm}
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
                        value={language.id}
                        onChange={(event) => handleLanguageSelectionChange(index, event.target.value)}
                        disabled={disableForm}
                      >
                        {availableLanguages.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
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
                        disabled={disableForm}
                      >
                        {languageLevelOptions.map((option) => (
                          <MenuItem key={option} value={option}>
                            {formatLanguageLevel(option)}
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
                          disabled={disableForm}
                        >
                          Eliminar idioma
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                ))}
              </Stack>
              {errors.languages && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.languages}
                </Typography>
              )}
            </MainCard>

            <MainCard title="Habilidades" border>
              <Autocomplete
                multiple
                disabled={disableForm}
                options={availableSkills}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                value={resume.skills}
                onChange={(event, value) => {
                  setResume((prev) => ({
                    ...prev,
                    skills: value
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    skills: undefined
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selecciona tus habilidades"
                    error={Boolean(errors.skills)}
                    helperText={
                      errors.skills ||
                      'Selecciona las habilidades que mejor representen tu perfil.'
                    }
                  />
                )}
              />
            </MainCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <MainCard title="Vista previa" border sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
            <Stack spacing={2.5}>
              <Box>
                <Typography variant="h2">{userName || 'Tu nombre'}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {[resume.city, resume.location].filter(Boolean).join(', ')}
                </Typography>
                {userEmail && (
                  <Typography variant="body2" color="text.secondary">
                    {userEmail}
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
                {resume.education.some((item) => item.institution || item.major) ? (
                  resume.education.map(
                    (item, index) =>
                      (item.institution || item.major) && (
                        <Box key={`preview-education-${index}`}>
                          <Typography variant="subtitle1">{item.major || 'Título académico'}</Typography>
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
                        (item.id || item.level) && (
                          <Chip
                            key={`preview-language-${index}`}
                            label={[item.name || availableLanguages.find((lang) => String(lang.id) === String(item.id))?.name, formatLanguageLevel(item.level)]
                              .filter(Boolean)
                              .join(' - ')}
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
                    resume.skills.map((skill) => <Chip key={skill.id} label={skill.name} size="small" variant="outlined" sx={skillChipSX} />)
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
