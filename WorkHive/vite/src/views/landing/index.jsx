import { Link as RouterLink } from 'react-router-dom';

// Logo
import logoCapas from 'assets/images/icons/logoCapas.png';

// Material-UI imports
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Stack,
  useTheme,
  useMediaQuery,
  Avatar
} from '@mui/material';

// Tabler Icons
import {
  IconBriefcase,
  IconUsers,
  IconBuilding,
  IconArrowRight,
  IconTrendingUp,
  IconChevronRight,
  IconChecks,
  IconUserPlus
} from '@tabler/icons-react';

// Framer Motion for premium entrance animations
import { motion } from 'framer-motion';

// Component wrapper for motion elements
const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ==================== NAVBAR ==================== */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${theme.palette.divider}`,

          height: '90px',
          zIndex: theme.zIndex.drawer + 1
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Logo */}
            <Box component={RouterLink} to="/" sx={{ textDecoration: 'none', display: 'flex', alignItems: 'center', height: '100%' }}>
              <img
                src={logoCapas}
                alt="WorkHive Logo"
                style={{
                  height: '4.5rem',
                  width: '11rem',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </Box>




            {/* Auth Buttons */}
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                component={RouterLink}
                to="/pages/login"
                variant="outlined"
                color="primary"
                sx={{
                  borderRadius: '24px',
                  px: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  borderWidth: '2px',
                  '&:hover': { borderWidth: '2px' }
                }}
              >
                Ingresar
              </Button>
              <Button
                component={RouterLink}
                to="/pages/register"
                variant="contained"
                color="secondary"
                startIcon={<IconUserPlus size={18} />}
                sx={{
                  borderRadius: '24px',
                  px: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: `0 4px 12px rgba(103, 58, 183, 0.25)`,
                  '&:hover': {
                    boxShadow: `0 6px 16px rgba(103, 58, 183, 0.35)`
                  }
                }}
              >
                {!isMobile ? 'Crear CV / Cuenta' : 'Registrarse'}
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ==================== HERO SECTION ==================== */}
      <Box
        sx={{
          position: 'relative',
          backgroundImage: `linear-gradient(to bottom, rgba(18, 25, 38, 0.88), rgba(21, 101, 192, 0.82)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          pt: { xs: 8, md: 12 },
          pb: { xs: 12, md: 16 },
          color: 'white',
          textAlign: 'center',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="md">
          {/* Animated Header */}
          <MotionBox
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant={isMobile ? 'h2' : 'h1'}
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '3.75rem' },
                lineHeight: 1.2,
                mb: 2,
                color: 'white',
                textShadow: '0 2px 4px rgba(122, 122, 122, 0.3)',
                fontFamily: 'Poppins, sans-serif'
              }}
            >
              ¡Ahora es el momento de cambiar!
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 400,
                color: 'grey.300',
                mb: 5,
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                maxWidth: '650px',
                mx: 'auto',
                lineHeight: 1.5
              }}
            >
              Encuentra el empleo que encaja contigo en WorkHive, la colmena de oportunidades laborales líder en la región.
            </Typography>
          </MotionBox>


        </Container>

        {/* Elegant Wave Curved SVG Divider */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            lineHeight: 0,
            zIndex: 2
          }}
        >
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ position: 'relative', display: 'block', width: 'calc(100% + 1.3px)', height: '80px' }}>
            <path
              d="M0,32L80,48C160,64,320,96,480,96C640,96,800,64,960,48C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
              fill="#ffffff"
            ></path>
          </svg>
        </Box>
      </Box>

      {/* ==================== RECRUITER CTA BAR ==================== */}
      <Container maxWidth="md" sx={{ mt: -4, position: 'relative', zIndex: 10 }}>
        <MotionBox
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Stack
            direction={isMobile ? 'column' : 'row'}
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            sx={{
              bgcolor: 'background.paper',
              border: `1.5px solid ${theme.palette.primary.light}`,
              borderRadius: '24px',
              p: { xs: 3, md: 4 },
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.05)',
              textAlign: isMobile ? 'center' : 'left'
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
                ¿Quieres publicar una oferta?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem' }}>
                ¿Eres una empresa? Recluta gratis al mejor talento hoy mismo y gestiona tus vacantes con facilidad.
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              to="/pages/login"
              variant="outlined"
              color="primary"
              endIcon={<IconChevronRight size={18} />}
              sx={{
                borderRadius: '24px',
                py: 1.5,
                px: 4,
                fontWeight: 700,
                borderWidth: '2px',
                textTransform: 'none',
                whiteSpace: 'nowrap',
                '&:hover': { borderWidth: '2px' }
              }}
            >
              Publicar oferta
            </Button>
          </Stack>
        </MotionBox>
      </Container>

      {/* ==================== DOUBLE CTA CARDS ==================== */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontWeight: 800,
            mb: 1.5,
            color: 'text.primary',
            fontFamily: 'Poppins, sans-serif',
            fontSize: { xs: '1.75rem', md: '2.5rem' }
          }}
        >
          Diseñado para cumplir tus metas profesionales
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          sx={{ mb: 7, maxWidth: '600px', mx: 'auto', fontWeight: 400 }}
        >
          Ya sea que busques dar tu siguiente gran paso laboral o armar el equipo ideal, WorkHive tiene las herramientas perfectas para ti.
        </Typography>

        <Grid container spacing={4}>
          {/* Card 1: Candidates */}
          <Grid item xs={12} md={6}>
            <MotionGrid
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              height="100%"
            >
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '24px',
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                    borderColor: theme.palette.secondary.light
                  },
                  p: 3
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bg: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.light})`,
                        bgcolor: 'secondary.light',
                        color: 'secondary.main',
                        width: 56,
                        height: 56
                      }}
                    >
                      <IconUsers size={28} />
                    </Avatar>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
                        Para Candidatos
                      </Typography>
                      <Typography variant="body2" color="secondary.main" sx={{ fontWeight: 600 }}>
                        Construye tu futuro hoy
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                    Sube tu CV en formato digital, busca empleos filtrados por categorías y ubicación, y aplica de forma directa. Mantén un seguimiento continuo del estado de tus aplicaciones en tiempo real.
                  </Typography>

                  <Stack spacing={1.5} sx={{ my: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconChecks size={20} color={theme.palette.success.main} />
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                        Búsqueda avanzada de empleos en todo el país
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconChecks size={20} color={theme.palette.success.main} />
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                        Hoja de vida interactiva y exportable
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconChecks size={20} color={theme.palette.success.main} />
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                        Alertas y notificaciones instantáneas de postulaciones
                      </Typography>
                    </Stack>
                  </Stack>

                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      component={RouterLink}
                      to="/pages/register"
                      variant="contained"
                      color="secondary"
                      endIcon={<IconArrowRight size={18} />}
                      fullWidth
                      sx={{
                        borderRadius: '16px',
                        py: 2,
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: `0 4px 15px rgba(103, 58, 183, 0.15)`
                      }}
                    >
                      Comenzar como Candidato
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </MotionGrid>
          </Grid>

          {/* Card 2: Recruiters */}
          <Grid item xs={12} md={6}>
            <MotionGrid
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              height="100%"
            >
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '24px',
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                    borderColor: theme.palette.primary.light
                  },
                  p: 3
                }}
              >
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: 'primary.light',
                        color: 'primary.main',
                        width: 56,
                        height: 56
                      }}
                    >
                      <IconBuilding size={28} />
                    </Avatar>
                    <Box>
                      <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
                        Para Reclutadores
                      </Typography>
                      <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
                        Encuentra y atrae el mejor talento
                      </Typography>
                    </Box>
                  </Stack>

                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                    Publica vacantes de forma rápida y sencilla para llegar a miles de profesionales capacitados. Revisa postulaciones mediante un panel con filtros, estadísticas y gestión optimizada de candidatos.
                  </Typography>

                  <Stack spacing={1.5} sx={{ my: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconChecks size={20} color={theme.palette.success.main} />
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                        Publicación ágil de ofertas laborales ilimitadas
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconChecks size={20} color={theme.palette.success.main} />
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                        Panel intuitivo de seguimiento de postulantes
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconChecks size={20} color={theme.palette.success.main} />
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                        Estadísticas de rendimiento de ofertas publicadas
                      </Typography>
                    </Stack>
                  </Stack>

                  <Box sx={{ mt: 'auto' }}>
                    <Button
                      component={RouterLink}
                      to="/pages/register?type=recruiter"
                      variant="contained"
                      color="primary"
                      endIcon={<IconArrowRight size={18} />}
                      fullWidth
                      sx={{
                        borderRadius: '16px',
                        py: 2,
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: `0 4px 15px rgba(33, 150, 243, 0.15)`
                      }}
                    >
                      Registrar Empresa
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </MotionGrid>
          </Grid>
        </Grid>
      </Container>

      {/* ==================== METRICS SECTION ==================== */}
      <Box sx={{ bgcolor: 'grey.50', py: 8, borderTop: `1px solid ${theme.palette.divider}`, borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {/* Metric 1 */}
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mb: 1, width: 48, height: 48 }}>
                  <IconBriefcase size={24} />
                </Avatar>
                <Typography variant="h1" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
                  +4,000
                </Typography>
                <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Ofertas Activas
                </Typography>
              </Stack>
            </Grid>

            {/* Metric 2 */}
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Avatar sx={{ bgcolor: 'secondary.light', color: 'secondary.main', mb: 1, width: 48, height: 48 }}>
                  <IconBuilding size={24} />
                </Avatar>
                <Typography variant="h1" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
                  +250
                </Typography>
                <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Empresas Registradas
                </Typography>
              </Stack>
            </Grid>

            {/* Metric 3 */}
            <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.dark', mb: 1, width: 48, height: 48 }}>
                  <IconTrendingUp size={24} />
                </Avatar>
                <Typography variant="h1" sx={{ fontWeight: 900, color: 'text.primary', fontFamily: 'Poppins, sans-serif' }}>
                  +15,000
                </Typography>
                <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Postulaciones Exitosas
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>


    </Box>
  );
}
