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
import * as companyService from 'services/companyService';
import * as vacancyService from 'services/vacancyService';
import {getSelectedTime} from 'services/applicationService';export default function Statistics() {

  
  const [genderData, setGenderData] = useState([]);
  const [topVacancies, setTopVacancies] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadData = async () => {
        try {
          setLoading(true);

          const [
            topVacanciesResponse,
            selectedTimesResponse,
            myCompanyResponse
          ] = await Promise.all([
            vacancyService.getTopVacancies(),
            getSelectedTime(),
            companyService.getMyCompany()
          ]);

          setTopVacancies(topVacanciesResponse.data);
          setSelectedTimes(selectedTimesResponse.data);

          const companyId = myCompanyResponse.data?.id;

          if (companyId) {
            const diversityResponse =
              await companyService.getCompanyGenderDiversity(companyId);

            const diversity = diversityResponse.data;

            setGenderData([
              { gender: 'Femenino', count: diversity?.F ?? 0 },
              { gender: 'Masculino', count: diversity?.M ?? 0 },
              { gender: 'Otro', count: diversity?.O ?? 0 }
            ]);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, []);
  
  if (loading) {
        return <Typography>Cargando estadísticas...</Typography>;
      }

      



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
      categories: topVacancies.map((d) => d.title),
      labels: {
        rotate: 0,
        trim: false,
        maxHeight: 100,
        style: {
          fontSize: '11px',
          fontWeight: 600
        },
        formatter: (value) => {
          const words = value.split(' ');
          const lines = [];
          let line = '';

          words.forEach(word => {
            if ((line + ' ' + word).length > 12) {
              lines.push(line);
              line = word;
            } else {
              line += (line ? ' ' : '') + word;
            }
          });

          if (line) lines.push(line);

          return lines;
        }
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
      data: topVacancies.map((d) => d.totalApplications)
    }
  ];

 const hiringChartOptions = {
  chart: {
    id: 'hiring-time-line',
    toolbar: { show: false },
    fontFamily: 'Inter, sans-serif'
  },
  colors: ['#673ab7'],
  stroke: {
    curve: 'smooth',
    width: 3
  },
  markers: {
    size: 5
  },
  dataLabels: {
    enabled: true
  },
  xaxis: {
    categories: selectedTimes.map(item => item.title),
    labels: {
      rotate: -25
    }
  },
  yaxis: {
    title: {
      text: 'Horas'
    }
  },
  tooltip: {
    y: {
      formatter: (value) => `${value.toFixed(2)} horas`
    }
  }
};

  const hiringChartSeries = [
    {
      name: 'horas',
      data: selectedTimes.map(item => item.hours)
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

 


  return (
    <MainCard title="Reportes y Estadísticas de Contratación">
      <Stack spacing={4}>
        {/* KPI Cards section */}
      

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
                  Mide el tiempo de respuesta promedio (en horas) desde que el candidato aplica hasta que se toma la decisión de contratación formal.
                </Typography>
                <Chart 
                  options={hiringChartOptions} 
                  series={hiringChartSeries} 
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
