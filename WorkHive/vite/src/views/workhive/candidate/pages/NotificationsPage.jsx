import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import { buttonSX, notices } from '../data/candidateData';

export default function CandidateNotificationsPage() {
  return (
    <>
      <PageHeading
        title="Notificaciones"
        description="Revisa novedades de tus postulaciones, alertas y mensajes."
        action={
          <Button variant="outlined" color="secondary" sx={buttonSX}>
            Marcar todas como leidas
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
