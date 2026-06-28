// material-ui
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

// project imports
import { drawerWidth } from 'store/constant';

function openedMixin(theme) {
  return {
    width: drawerWidth,
    borderRight: 'none',
    zIndex: 1099,
    background: theme.vars.palette.background.default,
    overflow: 'visible',
    boxShadow: 'none',
    transition: 'none'
  };
}

function closedMixin(theme) {
  return {
    borderRight: 'none',
    zIndex: 1099,
    background: theme.vars.palette.background.default,
    overflow: 'visible',
    width: 72,
    transition: 'none'
  };
}

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  borderRight: '0px',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: 'none',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

export default MiniDrawerStyled;
