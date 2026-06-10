import Box from '@mui/material/Box';

import workHiveLogo from 'assets/images/workhive-logo.png';

// ==============================|| LOGO ||============================== //

const Logo = () => {
    return (
        <Box
            component="img"
            src={workHiveLogo}
            alt="WorkHive"
            sx={{
                display: 'block',
                width: { xs: 160, sm: 190 },
                maxWidth: '100%',
                height: 'auto'
            }}
        />
    );
};

export default Logo;
