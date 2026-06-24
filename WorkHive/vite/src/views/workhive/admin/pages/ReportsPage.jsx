import { useMemo, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Chart from 'react-apexcharts';

import MainCard from 'ui-component/cards/MainCard';
import PageHeading from '../../candidate/components/PageHeading';
import useConfig from 'hooks/useConfig';

const reportData = {
  2024: {
    offers: [14, 18, 23, 21, 28, 31, 35, 38, 42, 47, 51, 56],
    registrations: [32, 39, 44, 48, 55, 63, 68, 74, 81, 88, 96, 104],
    companies: [4, 6, 5, 8, 7, 10, 9, 12, 11, 14, 13, 16],
    candidates: [24, 29, 33, 36, 41, 47, 51, 56, 62, 68, 74, 81],
    areas: [82, 64, 51, 43, 31, 24],
    gender: [164, 142, 2]
  },
  2025: {
    offers: [22, 26, 29, 35, 38, 44, 49, 53, 58, 64, 69, 75],
    registrations: [54, 62, 70, 79, 88, 97, 106, 118, 129, 141, 154, 168],
    companies: [7, 9, 8, 11, 13, 12, 15, 17, 16, 19, 21, 23],
    candidates: [39, 46, 52, 59, 66, 73, 81, 89, 98, 108, 119, 131],
    areas: [108, 83, 69, 57, 42, 35],
    gender: [211, 189, 3]
  },
  2026: {
    offers: [31, 36, 42, 48, 55, 61, 67, 72, 78, 84, 91, 98],
    registrations: [71, 83, 94, 108, 122, 138, 151, 164, 179, 193, 207, 224],
    companies: [10, 12, 15, 14, 18, 20, 22, 25, 27, 29, 32, 35],
    candidates: [52, 61, 69, 79, 90, 102, 113, 125, 138, 151, 165, 180],
    areas: [137, 105, 88, 73, 55, 46],
    gender: [264, 238, 2]
  }
};

const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const areaLabels = ['Tecnología', 'Administración', 'Ventas', 'Servicio al cliente', 'Diseño', 'Otros'];
const genderLabels = ['Masculino', 'Femenino', 'Otro'];
const genderColors = ['#319795', '#f59aa0', '#7ee36b'];
const areaColors = ['#2196f3', '#00cfa5', '#ffb020', '#ff4964', '#7c4dff', '#55c2da'];

function total(values) {
  return values.reduce((sum, value) => sum + value, 0);
}

function ChartCard({ title, subtitle, children }) {
  return (
    <MainCard
      border
      sx={{ height: '100%', borderRadius: 3 }}
      contentSX={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}
    >
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography variant="h3">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Stack>
      {children}
    </MainCard>
  );
}

export default function ReportsPage() {
  const theme = useTheme();
  const {
    state: { fontFamily }
  } = useConfig();
  const [year, setYear] = useState('2026');
  const [registrationType, setRegistrationType] = useState('companies');

  const commonLineOptions = useMemo(
    () => ({
      chart: {
        type: 'line',
        fontFamily,
        toolbar: { show: true, tools: { download: false, selection: false } },
        zoom: { enabled: true }
      },
      stroke: { curve: 'smooth', width: 4 },
      markers: { size: 4, hover: { size: 7 } },
      dataLabels: { enabled: false },
      grid: { borderColor: theme.vars.palette.divider, strokeDashArray: 4 },
      xaxis: {
        categories: months,
        labels: { style: { colors: theme.vars.palette.text.secondary } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        min: 0,
        labels: { style: { colors: theme.vars.palette.text.secondary } }
      },
      legend: { show: false }
    }),
    [fontFamily, theme]
  );

  const donutBaseOptions = useMemo(
    () => ({
      chart: { type: 'donut', fontFamily },
      stroke: { width: 3, colors: [theme.vars.palette.background.paper] },
      dataLabels: {
        enabled: true,
        formatter: (value) => `${value.toFixed(1)}%`,
        style: { fontSize: '12px', fontWeight: 700 }
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: '66%',
            labels: {
              show: true,
              name: { show: true, offsetY: 18 },
              value: {
                show: true,
                offsetY: -14,
                fontSize: '26px',
                fontWeight: 700,
                formatter: (value) => Number(value).toLocaleString('es-ES')
              },
              total: {
                show: true,
                label: 'Total personas',
                formatter: (chart) => total(chart.globals.seriesTotals).toLocaleString('es-ES')
              }
            }
          }
        }
      },
      legend: {
        position: 'bottom',
        fontSize: '13px',
        labels: { colors: theme.vars.palette.text.primary },
        markers: { size: 6, shape: 'circle' }
      },
      responsive: [{ breakpoint: 480, options: { chart: { height: 330 }, legend: { position: 'bottom' } } }]
    }),
    [fontFamily, theme]
  );

  const barOptions = useMemo(
    () => ({
      chart: {
        type: 'bar',
        fontFamily,
        toolbar: { show: true, tools: { download: false, selection: false } }
      },
      plotOptions: {
        bar: {
          borderRadius: 7,
          borderRadiusApplication: 'end',
          columnWidth: '52%'
        }
      },
      dataLabels: { enabled: false },
      grid: { borderColor: theme.vars.palette.divider, strokeDashArray: 4 },
      xaxis: {
        categories: months,
        labels: { style: { colors: theme.vars.palette.text.secondary } },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: { style: { colors: theme.vars.palette.text.secondary } }
      },
      legend: { show: false }
    }),
    [fontFamily, theme]
  );

  const genderOptions = {
    ...donutBaseOptions,
    labels: genderLabels,
    colors: genderColors,
    tooltip: {
      y: {
        formatter: (value) => `${value.toLocaleString('es-ES')} personas`,
        title: { formatter: (seriesName) => `${seriesName}:` }
      }
    }
  };

  const areaOptions = {
    ...donutBaseOptions,
    labels: areaLabels,
    colors: areaColors,
    tooltip: {
      y: {
        formatter: (value) => `${value.toLocaleString('es-ES')} candidatos`,
        title: { formatter: (seriesName) => `${seriesName}:` }
      }
    }
  };
  
  const [dbData, setDbData] = useState({
    companiesCount: 0,
    candidatesCount: 0,
    gender: [0, 0, 0],
    areas: [0, 0, 0, 0, 0, 0]
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDbStats = async () => {
      try {
        setLoading(true);
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        };

        // 1. Fetch global gender diversity stats (counts all candidates by gender)
        let m = 0, f = 0, o = 0;
        try {
          const res = await fetch(`${API_URL}/user/diversity`, { headers });
          if (res.ok) {
            const data = await res.json();
            m = data.data.M || 0;
            f = data.data.F || 0;
            o = data.data.O || 0;
          }
        } catch (e) {
          console.error("Error fetching diversity stats", e);
        }

        // 2. Fetch companies list
        let companiesCount = 0;
        try {
          const res = await fetch(`${API_URL}/companies`, { headers });
          if (res.ok) {
            const data = await res.json();
            companiesCount = data.data ? data.data.length : 0;
          }
        } catch (e) {
          console.error("Error fetching companies", e);
        }

        setDbData({
          companiesCount,
          candidatesCount: m + f + o,
          gender: [m, f, o],
          areas: [0, 0, 0, 0, 0, 0]
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDbStats();
  }, []);

  const showingCompanies = registrationType === 'companies';
  const currentMonthIndex = new Date().getMonth();
  
  const companyMonthly = Array(12).fill(0);
  companyMonthly[currentMonthIndex] = dbData.companiesCount;

  const candidateMonthly = Array(12).fill(0);
  candidateMonthly[currentMonthIndex] = dbData.candidatesCount;

  const selectedRegistrations = showingCompanies ? companyMonthly : candidateMonthly;
  const registrationsTotal = dbData.candidatesCount + dbData.companiesCount;
  const selectedRegistrationLabel = showingCompanies ? 'Empresas registradas' : 'Candidatos registrados';
  const selectedRegistrationTotal = showingCompanies ? dbData.companiesCount : dbData.candidatesCount;

  // Since we don't have endpoints for monthly offers
  const offersTotal = 0;
  const offersMonthly = Array(12).fill(0);
  const registrationsMonthly = Array(12).fill(0);
  registrationsMonthly[currentMonthIndex] = registrationsTotal;

  return (
    <>
      <PageHeading title="Reportes / Estadísticas" description="Consulta el crecimiento y la distribución de usuarios de WorkHive." />

      <MainCard border sx={{ mb: 3, borderRadius: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Box>
            <Typography variant="h3">Resumen del año {year}</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Pasa el mouse sobre las gráficas para consultar las cantidades exactas.
            </Typography>
          </Box>
        </Stack>
      </MainCard>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Ofertas publicadas" subtitle={`Actividad mensual durante ${year}`}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Chip color="secondary" label={`${offersTotal.toLocaleString('es-ES')} ofertas en total`} />
            </Stack>
            <Chart
              type="line"
              height={330}
              series={[{ name: 'Ofertas publicadas', data: offersMonthly }]}
              options={{
                ...commonLineOptions,
                colors: [theme.vars.palette.secondary.main],
                tooltip: { y: { formatter: (value) => `${value} ofertas` } }
              }}
            />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Personas registradas" subtitle={`Nuevos usuarios por mes durante ${year}`}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <Chip color="primary" label={`${registrationsTotal.toLocaleString('es-ES')} personas en total`} />
            </Stack>
            <Chart
              type="line"
              height={330}
              series={[{ name: 'Personas registradas', data: registrationsMonthly }]}
              options={{
                ...commonLineOptions,
                colors: [theme.vars.palette.primary.main],
                tooltip: { y: { formatter: (value) => `${value} personas` } }
              }}
            />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <ChartCard title="Registros mensuales" subtitle={`Empresas y candidatos registrados durante ${year}`}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ mb: 2, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}
            >
              <Stack direction="row" spacing={1}>
                <Button
                  variant={showingCompanies ? 'contained' : 'outlined'}
                  color="secondary"
                  onClick={() => setRegistrationType('companies')}
                >
                  Empresas
                </Button>
                <Button
                  variant={!showingCompanies ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => setRegistrationType('candidates')}
                >
                  Candidatos
                </Button>
              </Stack>
              <Chip
                color={showingCompanies ? 'secondary' : 'primary'}
                label={`${selectedRegistrationTotal.toLocaleString('es-ES')} ${showingCompanies ? 'empresas' : 'candidatos'} en total`}
              />
            </Stack>
            <Chart
              type="bar"
              height={360}
              series={[{ name: selectedRegistrationLabel, data: selectedRegistrations }]}
              options={{
                ...barOptions,
                colors: [showingCompanies ? theme.vars.palette.secondary.main : theme.vars.palette.primary.main],
                tooltip: {
                  y: {
                    formatter: (value) => `${value} ${showingCompanies ? 'empresas' : 'candidatos'}`,
                    title: { formatter: () => `${selectedRegistrationLabel}:` }
                  }
                }
              }}
            />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Candidatos por área" subtitle="Distribución de perfiles profesionales">
            <Chart type="donut" height={390} series={dbData.areas} options={areaOptions} />
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <ChartCard title="Personas por género" subtitle="Cantidad de usuarios registrados por género">
            <Chart type="donut" height={390} series={dbData.gender} options={genderOptions} />
          </ChartCard>
        </Grid>
      </Grid>
    </>
  );
}
