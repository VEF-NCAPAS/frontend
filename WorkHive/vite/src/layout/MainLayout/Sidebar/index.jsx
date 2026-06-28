import { memo, useMemo } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

// project imports
import MenuList from '../MenuList';
import MiniDrawerStyled from './MiniDrawerStyled';

import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| SIDEBAR DRAWER ||============================== //

function Sidebar() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const {
    state: { miniDrawer }
  } = useConfig();

  const usesMuiDrawer = downMD || (miniDrawer && drawerOpen);

  const drawer = useMemo(() => {
    const drawerTop = usesMuiDrawer ? '20px' : '148px';
    let drawerSX = { paddingLeft: '0px', paddingRight: '0px', marginTop: drawerTop };
    if (drawerOpen) drawerSX = { paddingLeft: '16px', paddingRight: '16px', marginTop: drawerTop };

    return (
      <Box sx={drawerSX}>
        <MenuList />
      </Box>
    );
  }, [drawerOpen, usesMuiDrawer]);

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: drawerWidth } }} aria-label="mailbox folders">
      {usesMuiDrawer ? (
        <Drawer
          variant={downMD ? 'temporary' : 'persistent'}
          anchor="left"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(!drawerOpen)}
          transitionDuration={0}
          slotProps={{
            paper: {
              sx: {
                mt: downMD ? 0 : 16,
                zIndex: 1099,
                width: drawerWidth,
                bgcolor: 'background.default',
                color: 'text.primary',
                borderRight: 'none',
                overflow: 'visible',
                transition: 'none'
              }
            }
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {drawer}
        </Drawer>
      ) : (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {drawer}
        </MiniDrawerStyled>
      )}
    </Box>
  );
}

export default memo(Sidebar);
