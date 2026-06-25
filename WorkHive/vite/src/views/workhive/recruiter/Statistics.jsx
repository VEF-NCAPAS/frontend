import { useState, useEffect } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

// chart
import Chart from 'react-apexcharts';

// assets
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PieChartIcon from '@mui/icons-material/PieChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { recruiterService } from 'services/recruiterService';
import * as companyService from 'services/companyService';

export default function Statistics() {

  const [stats, setStats] = useState({
      jobsApplicationsData: [
        { jobTitle: 'Frontend Developer', applicationsCount: 18 },
        { jobTitle: 'Backend Developer', applicationsCount: 12 },
        { jobTitle: 'UX/UI Designer', applicationsCount: 9 },
        { jobTitle: 'QA Engineer', applicationsCount: 7 }
      ],
      hiringTimes: [
        { name: 'Frontend Developer', days: 12 },
        { name: 'Backend Developer', days: 18 },
        { name: 'UX/UI Designer', days: 10 },
        { name: 'QA Engineer', days: 15 }
      ],
      summary: {
        activeJobs: 4,
        totalApplicants: 22,
        totalApplications: 46,
        selectionRate: 18
      }
    });
  const [genderData, setGenderData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const loadGenderStats = async () => {
        try {
          const myCompanyResponse = await companyService.getMyCompany();
          const companyId = myCompanyResponse.data?.id;

          if (!companyId) {
            console.error('No se encontró el id de la empresa');
            return;
          }

          const diversityResponse = await companyService.getCompanyGenderDiversity(companyId);
          const diversity = diversityResponse.data;

          setGenderData([
            { gender: 'Femenino', count: diversity?.F ?? 0 },
            { gender: 'Masculino', count: diversity?.M ?? 0 },
            { gender: 'Otro', count: diversity?.O ?? 0 }
          ]);
        } catch (err) {
          console.error('Error loading gender diversity stats', err);
        }
      };

      loadGenderStats();
    }, []);
      

  if (!stats) return <Typography>Cargando estadísticas...</Typography>;

  const { jobsApplicationsData, hiringTimes, summary } = stats;

  // Chart 1: Vacancies Most Applied To (Bar Chart)
  const barChartOptions = {
    chart: {
      id: 'job-applications-bar',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: false,
        columnWidth: '45%',
        distributed: true
      }
    },
    colors: ['#2196f3', '#00e676', '#ffb300', '#f44336', '#9c27b0'],
    dataLabels: { enabled: true },
    legend: { show: false },
    xaxis: {
      categories: jobsApplicationsData.map((d) => d.jobTitle),
      labels: {
        style: { fontSize: '11px', fontWeight: 600 }
      }
    },
    yaxis: {
      title: { text: 'Número de Postulaciones', style: { fontWeight: 600 } }
    },
    grid: { borderColor: '#f1f1f1' }
  };

  const barChartSeries = [
    {
      name: 'Postulaciones',
      data: jobsApplicationsData.map((d) => d.applicationsCount)
    }
  ];

  // Chart 2: Hiring Time in Days per Vacancy Candidate (Line Chart)
  const lineChartOptions = {
    chart: {
      id: 'hiring-times-line',
      toolbar: { show: false },
      fontFamily: 'Inter, sans-serif'
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    colors: ['#673ab7'],
    markers: { size: 5 },
    xaxis: {
      categories: hiringTimes.map((h) => h.name),
      title: { text: 'Candidatos Contratados / Evaluados', style: { fontWeight: 600 } }
    },
    yaxis: {
      title: { text: 'Días transcurridos', style: { fontWeight: 600 } }
    },
    grid: { borderColor: '#f1f1f1' }
  };

  const lineChartSeries = [
    {
      name: 'Días de Contratación',
      data: hiringTimes.map((h) => h.days)
    }
  ];

  // Chart 3: Diversity Gender Data (Donut Chart)
  const genderChartOptions = {
    chart: {
      id: 'gender-diversity-donut',
      fontFamily: 'Inter, sans-serif'
    },
    labels: genderData.map((g) => g.gender),
    colors: [ '#e91e63','#1e88e5', '#9e9e9e'],
    legend: { position: 'bottom', fontWeight: 600 },
    dataLabels: { enabled: true },
    plotOptions: {
      pie: {
        donut: { size: '60%' }
      }
    }
  };

  const genderChartSeries = genderData.map((g) => g.count);

  // Chart 4: Diversity Age Data (Pie Chart)
 


  return (
    <MainCard title="Reportes y Estadísticas de Contratación">
      <Stack spacing={4}>
        {/* KPI Cards section */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#e3f2fd', color: '#1e88e5', borderRadius: 3, border: '1px solid #bbdefb' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>VACANTES ACTIVAS</Typography>
                  <Typography variant="h2" fontWeight={700} color="#1565c0" mt={0.5}>{summary.activeJobs}</Typography>
                </Box>
                <WorkOutlineIcon sx={{ fontSize: 32, color: '#1e88e5', opacity: 0.8 }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#f3e5f5', color: '#8e24aa', borderRadius: 3, border: '1px solid #e1bee7' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>CANDIDATOS TOTALES</Typography>
                  <Typography variant="h2" fontWeight={700} color="#6a1b9a" mt={0.5}>{summary.totalApplicants}</Typography>
                </Box>
                <PeopleOutlineIcon sx={{ fontSize: 32, color: '#8e24aa', opacity: 0.8 }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#e8f5e9', color: '#43a047', borderRadius: 3, border: '1px solid #c8e6c9' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>APLICACIONES</Typography>
                  <Typography variant="h2" fontWeight={700} color="#2e7d32" mt={0.5}>{summary.totalApplications}</Typography>
                </Box>
                <AssignmentTurnedInIcon sx={{ fontSize: 32, color: '#43a047', opacity: 0.8 }} />
              </Stack>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: '#fff8e1', color: '#ffb300', borderRadius: 3, border: '1px solid #ffe082' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>TASA DE SELECCIÓN</Typography>
                  <Typography variant="h2" fontWeight={700} color="#ff8f00" mt={0.5}>{summary.selectionRate}%</Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 32, color: '#ffb300', opacity: 0.8 }} />
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts section 1: Popular Vacancies and Recruitment speed */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <BarChartIcon color="primary" />
                  <Typography variant="h4" fontWeight={600}>
                    Vacantes Más Aplicadas
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                  Este reporte indica qué ofertas de empleo están recibiendo mayor atención e interés por parte de los profesionales de El Salvador.
                </Typography>
                <Chart 
                  options={barChartOptions} 
                  series={barChartSeries} 
                  type="bar" 
                  height={320} 
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <ShowChartIcon color="primary" />
                  <Typography variant="h4" fontWeight={600}>
                    Tiempo de Contratación
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" mb={2}>
                  Mide el tiempo de respuesta promedio (en días) desde que el candidato aplica hasta que se toma la decisión de contratación formal.
                </Typography>
                <Chart 
                  options={lineChartOptions} 
                  series={lineChartSeries} 
                  type="line" 
                  height={320} 
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider />

        {/* Charts section 2: Anonimized Diversity Analysis */}
        <Box>
          <Box display="flex" alignItems="center" gap={1} mb={3}>
            <PieChartIcon color="secondary" />
            <Typography variant="h3" fontWeight={700}>
              Análisis de Diversidad (Datos Anonimizados)
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" mb={3}>
            Mapeo analítico agregado sobre la composición demográfica de los postulantes de acuerdo con regulaciones éticas de datos. Las estadísticas individuales permanecen 100% anonimizadas.
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight={600} mb={3} textAlign="left">
                    Distribución por genero
                  </Typography>
                  <Box display="flex" justifyContent="center">
                    <Chart 
                      options={genderChartOptions} 
                      series={genderChartSeries} 
                      type="donut" 
                      width={380} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            
          </Grid>
        </Box>
      </Stack>
    </MainCard>
  );
}
