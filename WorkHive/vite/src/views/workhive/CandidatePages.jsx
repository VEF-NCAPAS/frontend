import { Link } from 'react-router-dom';

// material-ui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import {
  IconBell,
  IconBookmark,
  IconBriefcase,
  IconBuilding,
  IconCheck,
  IconChevronRight,
  IconClock,
  IconFileText,
  IconMapPin,
  IconMessageCircle,
  IconPencil,
  IconSearch,
  IconUpload,
  IconUser
} from '@tabler/icons-react';

const jobs = [
  {
    title: 'Desarrollador Frontend React',
    company: 'Nexa Digital',
    location: 'San Salvador',
    type: 'Tiempo completo',
    salary: '$1,200 - $1,600',
    posted: 'Hace 2 horas',
    tags: ['React', 'JavaScript', 'Remoto']
  },
  {
    title: 'Diseñador UX/UI',
    company: 'Impulso Studio',
    location: 'Santa Tecla',
    type: 'Híbrido',
    salary: '$950 - $1,250',
    posted: 'Hoy',
    tags: ['Figma', 'Research', 'Producto']
  },
  {
    title: 'Analista de datos junior',
    company: 'Grupo Centro',
    location: 'La Libertad',
    type: 'Tiempo completo',
    salary: '$900 - $1,100',
    posted: 'Ayer',
    tags: ['SQL', 'Power BI', 'Excel']
  }
];

const applications = [
  { role: 'Desarrollador Frontend React', company: 'Nexa Digital', date: '24 mayo 2026', status: 'En revisión', color: 'warning' },
  { role: 'Especialista de soporte', company: 'CloudDesk', date: '18 mayo 2026', status: 'Entrevista', color: 'primary' },
  { role: 'Diseñador UX/UI', company: 'Impulso Studio', date: '09 mayo 2026', status: 'Finalizada', color: 'default' }
];

const notices = [
  {
    title: 'Tu postulación está en revisión',
    detail: 'Nexa Digital revisó tu perfil para Desarrollador Frontend React.',
    time: 'Hace 20 minutos',
    unread: true,
    icon: IconBriefcase
  },
  {
    title: 'Nueva oferta recomendada',
    detail: 'Analista de datos junior coincide con tus preferencias de búsqueda.',
    time: 'Hace 3 horas',
    unread: true,
    icon: IconBell
  },
  {
    title: 'Invitación a entrevista',
    detail: 'CloudDesk te invita a confirmar tu horario de entrevista.',
    time: 'Ayer',
    unread: false,
    icon: IconMessageCircle
  }
];

const buttonSX = { textTransform: 'none', whiteSpace: 'nowrap' };

function PageHeading({ title, description, action }) {
  return (
    <MainCard sx={{ mb: 3 }} contentSX={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ sm: 'center' }}>
        <Box>
          <Typography variant="h2" sx={{ mb: 0.75 }}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </Box>
        {action}
      </Stack>
    </MainCard>
  );
}

function StatCard({ value, label, color = 'secondary' }) {
  return (
    <MainCard border contentSX={{ p: 2, '&:last-child': { pb: 2 } }}>
      <Typography variant="h2" color={`${color}.dark`} sx={{ mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </MainCard>
  );
}

function JobItem({ job }) {
  return (
    <MainCard border boxShadow contentSX={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar variant="rounded" sx={{ bgcolor: 'secondary.light', color: 'secondary.main', flexShrink: 0 }}>
            <IconBuilding size={22} />
          </Avatar>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="h4">{job.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {job.company}
            </Typography>
          </Box>
          <IconBookmark size={20} color="#697586" />
        </Stack>

        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconMapPin size={16} />
            <Typography variant="caption">{job.location}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconBriefcase size={16} />
            <Typography variant="caption">{job.type}</Typography>
          </Stack>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <IconClock size={16} />
            <Typography variant="caption">{job.posted}</Typography>
          </Stack>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="space-between" alignItems={{ sm: 'center' }}>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {job.tags.map((tag) => (
              <Chip key={tag} size="small" label={tag} variant="outlined" color="secondary" />
            ))}
          </Stack>
          <Typography variant="subtitle1" color="secondary.dark">
            {job.salary}
          </Typography>
        </Stack>
      </Stack>
    </MainCard>
  );
}

export function CandidateJobsPage() {
  return (
    <>
      <PageHeading
        title="Buscar empleos"
        description="Encuentra oportunidades que coincidan con tu experiencia en El Salvador."
        action={
          <Button component={Link} to="/mi-perfil" variant="outlined" color="secondary" sx={buttonSX}>
            Completar mi perfil
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <MainCard contentSX={{ p: { xs: 2, sm: 3 }, '&:last-child': { pb: { xs: 2, sm: 3 } } }} sx={{ mb: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h4">¿Qué empleo estás buscando?</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    placeholder="Cargo, empresa o palabra clave"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconSearch size={18} />
                          </InputAdornment>
                        )
                      }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField select fullWidth defaultValue="all" label="Ubicación">
                    <MenuItem value="all">Todas</MenuItem>
                    <MenuItem value="ss">San Salvador</MenuItem>
                    <MenuItem value="st">Santa Tecla</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button fullWidth variant="contained" color="secondary" sx={{ ...buttonSX, height: '100%', minHeight: 50 }}>
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </MainCard>

          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h3">Ofertas recomendadas</Typography>
              <Typography variant="body2" color="text.secondary">
                24 resultados
              </Typography>
            </Stack>
            {jobs.map((job) => (
              <JobItem key={job.title} job={job} />
            ))}
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3}>
            <MainCard title="Tu búsqueda" border>
              <Stack spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Recibe alertas cuando se publiquen empleos relacionados con frontend y diseño.
                </Typography>
                <Button fullWidth variant="outlined" color="secondary" sx={buttonSX}>
                  Crear alerta de empleo
                </Button>
              </Stack>
            </MainCard>
            <MainCard title="Perfil destacado" border>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Completado</Typography>
                  <Typography variant="subtitle1" color="secondary.main">
                    78%
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={78} color="secondary" sx={{ height: 8, borderRadius: 8 }} />
                <Typography variant="body2" color="text.secondary">
                  Agrega tu experiencia más reciente para aumentar la visibilidad.
                </Typography>
              </Stack>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export function CandidateApplicationsPage() {
  return (
    <>
      <PageHeading
        title="Mis postulaciones"
        description="Da seguimiento a cada proceso y prepárate para tus entrevistas."
        action={
          <Button component={Link} to="/" variant="contained" color="secondary" sx={buttonSX}>
            Buscar más empleos
          </Button>
        }
      />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard value="08" label="Postulaciones enviadas" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard value="03" label="En revisión" color="warning" />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard value="01" label="Entrevista pendiente" color="primary" />
        </Grid>
      </Grid>
      <MainCard title="Actividad reciente" border contentSX={{ p: { xs: 1.5, sm: 2.5 } }}>
        <Stack divider={<Divider flexItem />}>
          {applications.map((application) => (
            <Stack
              key={application.role}
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              sx={{ py: 2 }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar variant="rounded" sx={{ bgcolor: 'primary.light', color: 'primary.dark' }}>
                  <IconBriefcase size={20} />
                </Avatar>
                <Box>
                  <Typography variant="h4">{application.role}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {application.company} · Postulado el {application.date}
                  </Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Chip label={application.status} color={application.color} size="small" variant="outlined" />
                <IconChevronRight size={18} />
              </Stack>
            </Stack>
          ))}
        </Stack>
      </MainCard>
    </>
  );
}

export function CandidateProfilePage() {
  return (
    <>
      <PageHeading
        title="Mi perfil"
        description="Mantén actualizada tu información para destacar ante las empresas."
        action={
          <Button variant="contained" color="secondary" startIcon={<IconPencil size={18} />} sx={buttonSX}>
            Editar perfil
          </Button>
        }
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard border>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Avatar sx={{ width: 82, height: 82, bgcolor: 'secondary.light', color: 'secondary.main' }}>
                <IconUser size={44} />
              </Avatar>
              <Box>
                <Typography variant="h3">Ana Martínez</Typography>
                <Typography variant="body2" color="text.secondary">
                  Desarrolladora Frontend
                </Typography>
              </Box>
              <Chip label="Disponible para trabajar" color="success" variant="outlined" />
              <Divider flexItem />
              <Box sx={{ width: '100%' }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="body2">Perfil completado</Typography>
                  <Typography variant="subtitle1" color="secondary.main">
                    78%
                  </Typography>
                </Stack>
                <LinearProgress variant="determinate" value={78} color="secondary" sx={{ height: 8, borderRadius: 8 }} />
              </Box>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <MainCard title="Información profesional" border>
              <Grid container spacing={2.5}>
                {[
                  ['Correo', 'ana.martinez@correo.com'],
                  ['Teléfono', '+503 7000 1234'],
                  ['Ubicación', 'San Salvador, El Salvador'],
                  ['Experiencia', '3 años']
                ].map(([label, value]) => (
                  <Grid key={label} size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary">
                      {label}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 0.5 }}>
                      {value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </MainCard>
            <MainCard title="Habilidades" border>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {['React', 'JavaScript', 'TypeScript', 'Material UI', 'Git', 'Figma'].map((skill) => (
                  <Chip key={skill} label={skill} color="secondary" variant="outlined" />
                ))}
              </Stack>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export function CandidateResumePage() {
  return (
    <>
      <PageHeading
        title="CV / Hoja de vida"
        description="Gestiona tu currículum y mantenlo listo para nuevas postulaciones."
        action={
          <Button variant="contained" color="secondary" startIcon={<IconUpload size={18} />} sx={buttonSX}>
            Subir nuevo CV
          </Button>
        }
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <MainCard title="Documento principal" border>
            <Stack spacing={2.5}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                <Avatar variant="rounded" sx={{ width: 58, height: 58, bgcolor: 'secondary.light', color: 'secondary.main' }}>
                  <IconFileText size={30} />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h4">CV_Ana_Martinez_2026.pdf</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Actualizado el 20 de mayo de 2026 · 1.2 MB
                  </Typography>
                </Box>
                <Chip label="Principal" size="small" color="success" variant="outlined" />
              </Stack>
              <Divider />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button variant="contained" color="secondary" fullWidth sx={buttonSX}>
                  Vista previa
                </Button>
                <Button variant="outlined" color="secondary" fullWidth sx={buttonSX}>
                  Descargar
                </Button>
              </Stack>
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <MainCard title="Recomendaciones" border>
            <Stack spacing={2}>
              {[
                'Incluye resultados medibles en tu experiencia.',
                'Agrega habilidades relevantes para cada oferta.',
                'Mantén un formato claro y de máximo dos páginas.'
              ].map((recommendation) => (
                <Stack key={recommendation} direction="row" spacing={1.25} alignItems="flex-start">
                  <Avatar sx={{ width: 22, height: 22, bgcolor: 'success.light', color: 'success.dark' }}>
                    <IconCheck size={14} />
                  </Avatar>
                  <Typography variant="body2">{recommendation}</Typography>
                </Stack>
              ))}
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}

export function CandidateNotificationsPage() {
  return (
    <>
      <PageHeading
        title="Notificaciones"
        description="Revisa novedades de tus postulaciones, alertas y mensajes."
        action={
          <Button variant="outlined" color="secondary" sx={buttonSX}>
            Marcar todas como leídas
          </Button>
        }
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <MainCard title="Recientes" border contentSX={{ p: { xs: 1.5, sm: 2.5 } }}>
            <Stack divider={<Divider flexItem />}>
              {notices.map((notice) => {
                const NoticeIcon = notice.icon;
                return (
                  <Stack
                    key={notice.title}
                    direction="row"
                    spacing={2}
                    sx={{ py: 2, bgcolor: notice.unread ? 'secondary.light' : 'transparent', px: 1.5, borderRadius: 2 }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: notice.unread ? 'secondary.main' : 'grey.100',
                        color: notice.unread ? 'common.white' : 'text.secondary'
                      }}
                    >
                      <NoticeIcon size={20} />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={0.5}>
                        <Typography variant="h4">{notice.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {notice.time}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {notice.detail}
                      </Typography>
                    </Box>
                  </Stack>
                );
              })}
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard title="Preferencias" border>
            <Stack spacing={2}>
              {[
                ['Alertas de empleo', 'Activas'],
                ['Actualizaciones de proceso', 'Activas'],
                ['Mensajes de empresas', 'Activas']
              ].map(([label, status]) => (
                <Stack key={label} direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">{label}</Typography>
                  <Chip label={status} color="success" size="small" variant="outlined" />
                </Stack>
              ))}
              <Button variant="outlined" color="secondary" sx={buttonSX}>
                Configurar avisos
              </Button>
            </Stack>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
}
