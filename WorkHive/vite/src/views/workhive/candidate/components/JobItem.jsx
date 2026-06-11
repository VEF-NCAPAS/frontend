import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import MainCard from 'ui-component/cards/MainCard';

import { IconBookmark, IconBriefcase, IconBuilding, IconClock, IconMapPin } from '@tabler/icons-react';

export default function JobItem({ job }) {
  return (
    <MainCard
      component={Link}
      to={`/candidato/buscar-empleos/${job.id}`}
      border
      boxShadow
      contentSX={{ p: { xs: 2, sm: 2.5 }, '&:last-child': { pb: { xs: 2, sm: 2.5 } } }}
      sx={{
        color: 'inherit',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': {
          boxShadow: '0 12px 28px rgba(54, 42, 112, 0.16)',
          transform: 'translateY(-6px)'
        }
      }}
    >
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
              <Chip
                key={tag}
                size="small"
                label={tag}
                variant="outlined"
                color="info"
                sx={{ borderColor: 'info.light', color: 'info.dark' }}
              />
            ))}
          </Stack>
          <Typography variant="subtitle1" sx={{ color: 'success.dark', fontWeight: 600 }}>
            {job.salary}
          </Typography>
        </Stack>
      </Stack>
    </MainCard>
  );
}
import { Link } from 'react-router-dom';
