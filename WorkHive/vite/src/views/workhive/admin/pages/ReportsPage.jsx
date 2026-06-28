import { useMemo, useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Chart from 'react-apexcharts';

import MainCard from 'ui-component/cards/MainCard';
import PageHeading from '../../candidate/components/PageHeading';
import useConfig from 'hooks/useConfig';
import * as userService from 'services/userService';
import { getVacancyVolumeReport } from 'services/vacancyService';
import { getApplicationVolumeReport } from 'services/applicationService';



const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const genderLabels = ['Masculino', 'Femenino', 'Otro'];
const genderColors = ['#319795', '#f59aa0', '#7ee36b'];

const formatDateInput = (date) => {
  const parsedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return '';

  return parsedDate.toISOString().slice(0, 10);
};

const getDefaultFromDate = () => formatDateInput(new Date(new Date().getFullYear(), 0, 1));
const getDefaultToDate = () => formatDateInput(new Date());

function total(values) {
  return values.reduce((sum, value) => sum + Number(value ?? 0), 0);
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

function KpiCard({ title, value, subtitle, color = 'primary' }) {
  const colorMap = {
    primary: { bg: 'linear-gradient(135deg, rgba(25,118,210,0.14) 0%, rgba(25,118,210,0.04) 100%)', border: 'rgba(25,118,210,0.22)' },
    secondary: { bg: 'linear-gradient(135deg, rgba(156,39,176,0.14) 0%, rgba(156,39,176,0.04) 100%)', border: 'rgba(156,39,176,0.22)' },
    success: { bg: 'linear-gradient(135deg, rgba(46,125,50,0.14) 0%, rgba(46,125,50,0.04) 100%)', border: 'rgba(46,125,50,0.22)' },
    warning: { bg: 'linear-gradient(135deg, rgba(237,108,2,0.14) 0%, rgba(237,108,2,0.04) 100%)', border: 'rgba(237,108,2,0.22)' }
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <MainCard
      border
      sx={{
        height: '100%',
        borderRadius: 3,
        background: selectedColor.bg,
        borderColor: selectedColor.border,
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)'
      }}
      contentSX={{ p: { xs: 2.2, sm: 2.5 }, '&:last-child': { pb: { xs: 2.2, sm: 2.5 } } }}
    >
      <Stack spacing={1}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={1.2}>
          {title}
        </Typography>
        <Typography variant="h2" fontWeight={800} lineHeight={1.1}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </Stack>
    </MainCard>
  );
}

export default function ReportsPage() {
  const theme = useTheme();
  const {
    state: { fontFamily }
  } = useConfig();

  const [fromDate, setFromDate] = useState(getDefaultFromDate());
  const [toDate, setToDate] = useState(getDefaultToDate());
  const [groupBy, setGroupBy] = useState('month');
  const [dateError, setDateError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [vacancyReport, setVacancyReport] = useState(null);
  const [applicationReport, setApplicationReport] = useState(null);
  const [diversityData, setDiversityData] = useState({ M: 0, F: 0, O: 0 });

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

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);

        if (fromDate && toDate && fromDate > toDate) {
          setDateError('La fecha inicial no puede ser mayor que la fecha final.');
          setUserGrowthData([]);
          setVacancyReport(null);
          setApplicationReport(null);
          setDiversityData({ M: 0, F: 0, O: 0 });
          return;
        }

        setDateError('');

        const [growthPayload, vacancyPayload, applicationPayload, diversityPayload] = await Promise.all([
          userService.getUserGrowthReport({ from: fromDate, to: toDate, groupBy }),
          getVacancyVolumeReport({ from: fromDate, to: toDate }),
          getApplicationVolumeReport({ from: fromDate, to: toDate }),
          userService.getGlobalDiversityStats()
        ]);

        const growthItems = Array.isArray(growthPayload?.growth)
          ? growthPayload.growth
          : Array.isArray(growthPayload?.data?.growth)
            ? growthPayload.data.growth
            : [];

        const normalizedDiversity = diversityPayload?.data ?? diversityPayload ?? {};

        setUserGrowthData(growthItems);
        setVacancyReport(vacancyPayload?.data ?? vacancyPayload ?? {});
        setApplicationReport(applicationPayload?.data ?? applicationPayload ?? {});
        setDiversityData({
          M: Number(normalizedDiversity.M ?? normalizedDiversity.m ?? 0),
          F: Number(normalizedDiversity.F ?? normalizedDiversity.f ?? 0),
          O: Number(normalizedDiversity.O ?? normalizedDiversity.o ?? 0)
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [fromDate, toDate, groupBy]);

  const userGrowthCategories = userGrowthData.map((item) => item.period ?? item.label ?? '');
  const userGrowthSeries = useMemo(() => [
    {
      name: 'Candidates',
      data: userGrowthData.map((item) => Number(item.candidates ?? item.candidateCount ?? 0))
    },
    {
      name: 'Recruiters',
      data: userGrowthData.map((item) => Number(item.recruiters ?? item.recruiterCount ?? 0))
    }
  ], [userGrowthData]);

  const growthOptions = useMemo(() => ({
    ...commonLineOptions,
    colors: [theme.vars.palette.primary.main, theme.vars.palette.secondary.main],
    legend: {
      show: true,
      position: 'bottom',
      labels: { colors: theme.vars.palette.text.primary }
    },
    xaxis: {
      categories: userGrowthCategories,
      labels: { style: { colors: theme.vars.palette.text.secondary } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    tooltip: {
      y: { formatter: (value) => `${value} nuevos registros` }
    }
  }), [commonLineOptions, theme, userGrowthCategories]);

  const vacancyTotal = Number(vacancyReport?.totalVacancies ?? vacancyReport?.total ?? vacancyReport?.count ?? 0);
  const activeVacancyTotal = Number(vacancyReport?.activeVacancies ?? 0);
  const closedVacancyTotal = Number(vacancyReport?.closedVacancies ?? 0);
  const applicationTotal = Number(applicationReport?.totalApplications ?? applicationReport?.total ?? applicationReport?.count ?? 0);
  const userGrowthTotal = userGrowthData.reduce((sum, item) => sum
    + Number(item.candidates ?? item.candidateCount ?? 0)
    + Number(item.recruiters ?? item.recruiterCount ?? 0), 0);
  const recruitmentSummaryTotal = diversityData.M + diversityData.F + diversityData.O;
  const genderTotal = Math.max(recruitmentSummaryTotal, 1);
  const genderSegments = [
    { label: 'Masculino', value: diversityData.M, color: genderColors[0] },
    { label: 'Femenino', value: diversityData.F, color: genderColors[1] },
    { label: 'Otro', value: diversityData.O, color: genderColors[2] }
  ];

  const donutOptions = useMemo(() => ({
    chart: { type: 'donut', fontFamily, toolbar: { show: false } },
    labels: genderLabels,
    colors: genderColors,
    dataLabels: {
      enabled: true,
      formatter: (value) => `${value.toFixed(1)}%`,
      style: { fontSize: '12px', fontWeight: 700 }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: { show: false },
            value: {
              show: true,
              fontSize: '20px',
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
      labels: { colors: theme.vars.palette.text.primary },
      markers: { size: 8, shape: 'circle' }
    },
    tooltip: {
      y: { formatter: (value) => `${value.toLocaleString('es-ES')} personas` }
    }
  }), [fontFamily, theme]);

  return (
    <>
      <PageHeading title="Reportes / Estadísticas" description="Consulta el crecimiento y la distribución de usuarios de WorkHive." />

      <MainCard border sx={{ mb: 3, borderRadius: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: { xs: 'stretch', md: 'center' }, justifyContent: 'space-between' }}
        >
          <Box>
            <Typography variant="h3">Resumen del periodo</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              Elige un rango de fechas y el nivel de agrupación para consultar los reportes exactos.
            </Typography>
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <TextField
              label="Desde"
              type="date"
              size="small"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Hasta"
              type="date"
              size="small"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              select
              label="Agrupar por"
              size="small"
              value={groupBy}
              onChange={(event) => setGroupBy(event.target.value)}
              sx={{ minWidth: 170 }}
            >
              <MenuItem value="day">Día</MenuItem>
              <MenuItem value="month">Mes</MenuItem>
            </TextField>
          </Stack>
        </Stack>
        {dateError && (
          <Typography color="error.main" sx={{ mt: 1.5 }}>
            {dateError}
          </Typography>
        )}
      </MainCard>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <KpiCard title="Total Applications" value={loading ? '…' : applicationTotal.toLocaleString('es-ES')} subtitle="Postulaciones registradas en el rango" color="primary" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <KpiCard title="Vacancies Created" value={loading ? '…' : vacancyTotal.toLocaleString('es-ES')} subtitle="Vacantes creadas en el rango" color="secondary" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <KpiCard title="Vacancies Active" value={loading ? '…' : activeVacancyTotal.toLocaleString('es-ES')} subtitle="Vacantes actualmente activas" color="success" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <KpiCard title="Vacancies Closed" value={loading ? '…' : closedVacancyTotal.toLocaleString('es-ES')} subtitle="Vacantes cerradas en el rango" color="warning" />
            </Grid>
          </Grid>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <ChartCard title="User Growth" subtitle={`Tendencia de nuevos candidatos y reclutadores por ${groupBy === 'month' ? 'mes' : 'día'} en el rango seleccionado`}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2, flexWrap: 'wrap' }}>
              <Typography variant="body2" color="text.secondary">
                Total del rango: {loading ? '…' : userGrowthTotal.toLocaleString('es-ES')} usuarios
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Último período: {loading ? '…' : (userGrowthData[userGrowthData.length - 1]?.candidates ?? 0) + (userGrowthData[userGrowthData.length - 1]?.recruiters ?? 0)}
              </Typography>
            </Stack>
            {loading ? (
              <Box sx={{ minHeight: 330, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : userGrowthData.length > 0 ? (
              <Chart
                type="line"
                height={330}
                series={userGrowthSeries}
                options={growthOptions}
              />
            ) : (
              <Box sx={{ minHeight: 330, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed', borderColor: 'divider', borderRadius: 2 }}>
                <Typography color="text.secondary">No hay datos de crecimiento para este rango.</Typography>
              </Box>
            )}
          </ChartCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <ChartCard title="Personas por género" subtitle="Distribución proporcional de usuarios registrados por género">
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Chart type="donut" height={280} series={[diversityData.M, diversityData.F, diversityData.O]} options={donutOptions} />
              </Box>
              <Stack spacing={1}>
                {genderSegments.map((segment) => (
                  <Box key={segment.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: segment.color }} />
                      <Typography variant="body2">{segment.label}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {Math.round((segment.value / genderTotal) * 100)}%
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Stack>
          </ChartCard>
        </Grid>
      </Grid>
    </>
  );
}
