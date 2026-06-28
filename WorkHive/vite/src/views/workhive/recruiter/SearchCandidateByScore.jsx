import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';

import MainCard from 'ui-component/cards/MainCard';

import { getVacancies } from 'services/vacancyService';
import { getAllSkills } from 'services/skillService';
import { getAllLanguages } from 'services/languageService';
import { getCandidatesByVacancy } from 'services/candidateService';
import PremiumGuard from 'ui-component/PremiumGuard';

export default function SearchCandidateByScore() {
    const navigate = useNavigate();

    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');

    const [availableSkills, setAvailableSkills] = useState([]);
    const [availableLanguages, setAvailableLanguages] = useState([]);

    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);

    const [education, setEducation] = useState('');
    const [location, setLocation] = useState('');
    const [minimumExperience, setMinimumExperience] = useState('');

    const [candidates, setCandidates] = useState([]);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState('');

    const normalizeText = (text = '') =>
        text
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s]/g, '')
            .toLowerCase()
            .trim();

    useEffect(() => {
        const loadData = async () => {

            try {

                const vacanciesResponse = await getVacancies({
                    page: 0,
                    size: 50
                });

                const vacancyPayload =
                    vacanciesResponse?.data ??
                    vacanciesResponse;

                const vacancies =
                    vacancyPayload?.content ??
                    vacancyPayload?.data?.content ??
                    [];

                setJobs(vacancies);

                if (vacancies.length > 0) {

                    setSelectedJobId(vacancies[0].id);

                }

            } catch (e) {

                console.error(e);

            }

            try {

                const skills = await getAllSkills();

                setAvailableSkills(
                    skills.data ??
                    skills
                );

            } catch (e) {

                console.error(e);

            }

            try {

                const languages = await getAllLanguages();

                setAvailableLanguages(
                    languages.data ??
                    languages
                );

            } catch (e) {

                console.error(e);

            }

        };;

        loadData();
    }, []);

    const handleSearch = async () => {

        if (!selectedJobId) {

            return;

        }

        setLoading(true);
        setError('');

        try {

            const params = {

                skills: selectedSkills.map(
                    skill => normalizeText(skill.name)
                ),

                languages: selectedLanguages.map(
                    language => normalizeText(language.name)
                ),

                education:
                    education
                        ? normalizeText(education)
                        : undefined,

                location:
                    location
                        ? normalizeText(location)
                        : undefined,

                minimumExperience:
                    minimumExperience !== ''

                        ? Number(minimumExperience)

                        : undefined

            };

            const response =
                await getCandidatesByVacancy(
                    selectedJobId,
                    params
                );

            const payload =
                response?.data ??
                response;

            const result =
                payload?.content ??
                payload?.data?.content ??
                [];

            result.sort(
                (a, b) => b.score - a.score
            );

            setCandidates(result);

        } catch (e) {

            console.error(e);

            setCandidates([]);

            setError(
                'No fue posible obtener los candidatos.'
            );

        } finally {

            setLoading(false);

        }

    };



    const handleViewProfile = (candidate) => {

        navigate('/reclutador/postulantes', {

            state: {

                candidateProfileId:
                    candidate.candidateProfileId,

                cvId:
                    candidate.cvId

            }

        });

    };

    const selectedJob = jobs.find((job) => job.id === selectedJobId);

    return (
    <PremiumGuard>
        <MainCard title="Búsqueda Inteligente de Candidatos">

            <Stack spacing={3}>

                <Box>

                    <Typography
                        variant="h4"
                        color="primary"
                        fontWeight={600}
                        mb={1}
                    >
                        Buscar candidatos por Score
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        mb={3}
                    >
                        Encuentra los candidatos con mejor compatibilidad para una
                        vacante utilizando skills, idiomas, educación,
                        ubicación y experiencia.
                    </Typography>

                    <Grid container spacing={2}>

                        <Grid item xs={12} md={6}>

                            <FormControl fullWidth>

                                <InputLabel>
                                    Vacante
                                </InputLabel>

                                <Select
                                    value={selectedJobId}
                                    label="Vacante"
                                    onChange={(e) =>
                                        setSelectedJobId(
                                            e.target.value
                                        )
                                    }
                                >

                                    {
                                        jobs.map(job => (
                                            <MenuItem
                                                key={job.id}
                                                value={job.id}
                                            >
                                                {job.title}
                                            </MenuItem>
                                        ))
                                    }

                                </Select>

                            </FormControl>

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <Autocomplete

                                multiple

                                options={availableSkills}

                                value={selectedSkills}

                                onChange={(e, newValue) =>
                                    setSelectedSkills(newValue)
                                }

                                getOptionLabel={(option) =>
                                    option.name
                                }

                                renderTags={(value, getTagProps) =>

                                    value.map((option, index) => (

                                        <Chip

                                            label={option.name}

                                            {...getTagProps({ index })}

                                        />

                                    ))

                                }

                                renderInput={(params) =>

                                    <TextField

                                        {...params}

                                        label="Skills"

                                    />

                                }

                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <Autocomplete

                                multiple

                                options={availableLanguages}

                                value={selectedLanguages}

                                onChange={(e, newValue) =>
                                    setSelectedLanguages(newValue)
                                }

                                getOptionLabel={(option) =>
                                    option.name
                                }

                                renderTags={(value, getTagProps) =>

                                    value.map((option, index) => (

                                        <Chip

                                            label={option.name}

                                            {...getTagProps({ index })}

                                        />

                                    ))

                                }

                                renderInput={(params) =>

                                    <TextField

                                        {...params}

                                        label="Idiomas"

                                    />

                                }

                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField

                                fullWidth

                                label="Educación"

                                value={education}

                                onChange={(e) =>
                                    setEducation(
                                        e.target.value
                                    )
                                }

                            />

                        </Grid>

                        <Grid item xs={12} md={6}>

                            <TextField

                                fullWidth

                                label="Ubicación"

                                value={location}

                                onChange={(e) =>
                                    setLocation(
                                        e.target.value
                                    )
                                }

                            />

                        </Grid>

                        <Grid item xs={12} md={3}>

                            <TextField

                                fullWidth

                                type="number"

                                label="Experiencia mínima"

                                value={minimumExperience}

                                onChange={(e) =>
                                    setMinimumExperience(
                                        e.target.value
                                    )
                                }

                            />

                        </Grid>

                        <Grid item xs={12} md={3}>

                            <Button

                                fullWidth

                                sx={{
                                    height: '56px'
                                }}

                                variant="contained"

                                onClick={handleSearch}

                            >

                                Buscar

                            </Button>

                        </Grid>

                    </Grid>

                </Box>

                <Divider />

                <Typography
                    variant="h5"
                    fontWeight={600}
                >

                    Candidatos encontrados ({candidates.length})

                </Typography>

                {
                    loading ?

                        <Paper sx={{ p: 5, textAlign: 'center' }}>

                            Cargando...

                        </Paper>

                        :

                        error ?

                            <Paper sx={{ p: 5, textAlign: 'center' }}>

                                {error}

                            </Paper>

                            :
                            (
                                <Grid container spacing={3}>{
                                    candidates.map(candidate => (

                                        <Grid
                                            item
                                            xs={12}
                                            md={6}
                                            key={candidate.candidateProfileId}
                                        >

                                            <Card
                                                sx={{
                                                    borderRadius: 3,
                                                    transition: '0.2s',
                                                    '&:hover': {
                                                        transform: 'translateY(-3px)'
                                                    }
                                                }}
                                            >
                                                <CardContent
                                                    sx={{
                                                        p: 3
                                                    }}>
                                                    <Box
                                                        display="flex"
                                                        justifyContent="space-between"
                                                        alignItems="flex-start"
                                                        mb={2}
                                                    >

                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                            gap={2}
                                                        >

                                                            <Avatar
                                                                sx={{
                                                                    width: 56,
                                                                    height: 56,
                                                                    bgcolor: 'primary.main',
                                                                    fontSize: 22,
                                                                    fontWeight: 700
                                                                }}
                                                            >
                                                                {candidate.name
                                                                    ?.split(' ')
                                                                    .map(n => n[0])
                                                                    .join('')
                                                                    .substring(0, 2)}
                                                            </Avatar>

                                                            <Box>

                                                                <Typography
                                                                    variant="h4"
                                                                    fontWeight={700}
                                                                >
                                                                    {candidate.name}
                                                                </Typography>

                                                                <Stack
                                                                    direction="row"
                                                                    spacing={1}
                                                                    alignItems="center"
                                                                    mt={0.5}
                                                                >

                                                                    <EmailIcon
                                                                        fontSize="small"
                                                                        color="action"
                                                                    />

                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                    >
                                                                        {candidate.email}
                                                                    </Typography>

                                                                </Stack>

                                                                <Stack
                                                                    direction="row"
                                                                    spacing={1}
                                                                    alignItems="center"
                                                                    mt={0.5}
                                                                >

                                                                    <LocationOnIcon
                                                                        fontSize="small"
                                                                        color="action"
                                                                    />

                                                                    <Typography
                                                                        variant="body2"
                                                                        color="text.secondary"
                                                                    >
                                                                        {candidate.city}
                                                                        {
                                                                            candidate.location
                                                                            &&
                                                                            `, ${candidate.location}`
                                                                        }
                                                                    </Typography>

                                                                </Stack>

                                                            </Box>

                                                        </Box>

                                                        <Chip
                                                            color={
                                                                candidate.score >= 80
                                                                    ? "success"
                                                                    : candidate.score >= 60
                                                                        ? "warning"
                                                                        : "error"
                                                            }
                                                            label={`${(candidate.score ?? 0).toFixed(1)} %`}
                                                            icon={<WorkspacePremiumIcon />}
                                                            sx={{
                                                                fontWeight: 700,
                                                                fontSize: 15,
                                                                height: 38
                                                            }}
                                                        />

                                                    </Box>

                                                    <Divider sx={{ my: 2 }} />

                                                    <Typography
                                                        variant="subtitle2"
                                                        color="text.secondary"
                                                    >

                                                        Compatibilidad con la vacante

                                                    </Typography>

                                                    <Box
                                                        mt={1}
                                                        mb={2}
                                                    >

                                                        <Box
                                                            sx={{
                                                                width: '100%',
                                                                height: 10,
                                                                bgcolor: '#ececec',
                                                                borderRadius: 5,
                                                                overflow: 'hidden'
                                                            }}
                                                        >

                                                            <Box
                                                                sx={{
                                                                    width: `${candidate.score ?? 0}%`,
                                                                    height: '100%',
                                                                    bgcolor:
                                                                        candidate.score >= 80
                                                                            ? '#4caf50'
                                                                            : candidate.score >= 60
                                                                                ? '#ff9800'
                                                                                : '#f44336',
                                                                    transition: '0.4s'
                                                                }}
                                                            />

                                                        </Box>

                                                    </Box>

                                                    <Grid
                                                        container
                                                        spacing={2}
                                                    >

                                                        <Grid item xs={6}>

                                                            <Paper
                                                                variant="outlined"
                                                                sx={{
                                                                    p: 2,
                                                                    textAlign: 'center'
                                                                }}
                                                            >

                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >
                                                                    Ciudad
                                                                </Typography>

                                                                <Typography
                                                                    fontWeight={700}
                                                                >
                                                                    {candidate.city}
                                                                </Typography>

                                                            </Paper>

                                                        </Grid>

                                                        <Grid item xs={6}>

                                                            <Paper
                                                                variant="outlined"
                                                                sx={{
                                                                    p: 2,
                                                                    textAlign: 'center'
                                                                }}
                                                            >

                                                                <Typography
                                                                    variant="caption"
                                                                    color="text.secondary"
                                                                >
                                                                    Ubicación
                                                                </Typography>

                                                                <Typography
                                                                    fontWeight={700}
                                                                >
                                                                    {candidate.location}
                                                                </Typography>

                                                            </Paper>

                                                        </Grid>

                                                    </Grid>

                                                    <Box
                                                        mt={3}
                                                        display="flex"
                                                        justifyContent="flex-end"
                                                    >

                                                        <Button
                                                            variant="contained"
                                                            onClick={() =>
                                                                handleViewProfile(candidate)
                                                            }
                                                        >
                                                            Ver perfil
                                                        </Button>

                                                    </Box>
                                                </CardContent>
                                            </Card>


                                        </Grid>

                                    ))

                                }

                                </Grid>

                            )}

            </Stack >

        </MainCard >

    </PremiumGuard>
    );

}
