import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCvByCandidate } from 'services/cvService';
import { getMyProfile } from 'services/userService';
import { findGender, getGenderLabel, getStoredGender } from 'utils/genderUtils';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

import PageHeading from '../components/PageHeading';
import { buttonSX } from '../data/candidateData';

import { IconBriefcase, IconPencil, IconUser } from '@tabler/icons-react';

const getStoredProfile = () => ({
  name: localStorage.getItem('name') || 'Usuario',
  email: localStorage.getItem('email') || '',
  gender: getStoredGender()
});

const emptyResume = {
  location: '',
  city: '',
  experiences: [],
  skills: []
};

export default function CandidateProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(getStoredProfile);
  const [resume, setResume] = useState(emptyResume);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    const loadResume = async () => {
      try {
        setLoading(true);
        setError('');
        setProfile(getStoredProfile());

        const [cvResult, userResult] = await Promise.allSettled([getCvByCandidate(), getMyProfile()]);

        const cvResponse = cvResult.status === 'fulfilled' ? cvResult.value : {};
        const cv = cvResponse?.data ?? cvResponse ?? {};
        const user = userResult.status === 'fulfilled' ? userResult.value : {};

        if (!ignore) {
          const gender = findGender(
            user.gender,
            cv.gender,
            cv.user?.gender,
            cv.candidate?.gender,
            cv.candidate?.user?.gender,
            getStoredGender()
          );

          if (gender) {
            localStorage.setItem('gender', gender);
          }

          if (user.name) {
            localStorage.setItem('name', user.name);
          }

          if (user.email) {
            localStorage.setItem('email', user.email);
          }

          setProfile((currentProfile) => ({
            ...currentProfile,
            name: user.name || currentProfile.name,
            email: user.email || currentProfile.email,
            gender: gender || currentProfile.gender
          }));

          setResume({
            location: cv.location || cv.country || '',
            city: cv.city || '',
            experiences: Array.isArray(cv.experiences) ? cv.experiences : [],
            skills: Array.isArray(cv.skills) ? cv.skills : []
          });
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.message || err.message || 'No se pudo cargar tu informacion profesional.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadResume();

    return () => {
      ignore = true;
    };
  }, []);

  const location = [resume.city, resume.location].filter(Boolean).join(', ') || 'Sin ubicacion registrada';

  const professionalInfo = [
    ['Correo', profile.email || 'Sin correo registrado'],
    ['Genero', getGenderLabel(profile.gender) || 'Sin genero registrado'],
    ['Ubicacion', location]
  ];

  const experiences = useMemo(
    () => resume.experiences.filter((experience) => experience.position || experience.company || experience.description),
    [resume.experiences]
  );

  const skills = useMemo(
    () => resume.skills.map((skill) => (typeof skill === 'string' ? skill : skill?.name)).filter(Boolean),
    [resume.skills]
  );

  return (
    <>
      <PageHeading
        title="Mi perfil"
        description="Manten actualizada tu informacion personal para que WorkHive use tus datos correctos."
        action={
          <Button
            variant="contained"
            color="secondary"
            startIcon={<IconPencil size={18} />}
            sx={buttonSX}
            onClick={() => navigate('/candidato/mi-perfil/editar')}
          >
            Editar perfil
          </Button>
        }
      />

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard border>
            <Stack spacing={2} alignItems="center" textAlign="center">
              <Avatar sx={{ width: 82, height: 82, bgcolor: 'secondary.light', color: 'secondary.main' }}>
                <IconUser size={44} />
              </Avatar>
              <Box>
                <Typography variant="h3">{profile.name || 'Usuario'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Candidato
                </Typography>
              </Box>
              <Divider flexItem />
              <Chip label={profile.email || 'Correo pendiente'} color="secondary" variant="outlined" />
            </Stack>
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={3}>
            <MainCard title="Informacion profesional" border>
              {loading ? (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CircularProgress color="secondary" size={22} />
                  <Typography variant="body2" color="text.secondary">
                    Cargando perfil...
                  </Typography>
                </Stack>
              ) : (
                <Grid container spacing={2.5}>
                  {professionalInfo.map(([label, value]) => (
                    <Grid key={label} size={{ xs: 12, sm: 6 }}>
                      <Typography variant="caption" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 0.5 }}>
                        {value}
                      </Typography>
                    </Grid>
                  ))}
                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 1 }} />
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconBriefcase size={19} />
                        <Typography variant="h4">Experiencias</Typography>
                      </Stack>
                      {experiences.length > 0 ? (
                        experiences.map((experience, index) => (
                          <Box key={`${experience.position || 'experiencia'}-${index}`}>
                            <Typography variant="subtitle1">{experience.position || 'Puesto no especificado'}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {[experience.company, [experience.hireDate, experience.endDate].filter(Boolean).join(' - ')]
                                .filter(Boolean)
                                .join(' | ')}
                            </Typography>
                            {experience.description && (
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {experience.description}
                              </Typography>
                            )}
                          </Box>
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Aun no has agregado experiencias a tu CV.
                        </Typography>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </MainCard>
            <MainCard title="Habilidades" border>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {skills.length > 0 ? (
                  skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      variant="outlined"
                      color="info"
                      sx={{ borderColor: 'info.light', color: 'info.dark' }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Aun no has agregado habilidades a tu CV.
                  </Typography>
                )}
              </Stack>
            </MainCard>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
