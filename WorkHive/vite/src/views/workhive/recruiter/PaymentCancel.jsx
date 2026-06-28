import { Cancel } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
      p={2}
    >
      <Paper
        elevation={5}
        sx={{
          maxWidth: 500,
          width: '100%',
          p: 5,
          textAlign: 'center',
          borderRadius: 3
        }}
      >
        <Cancel
          color="error"
          sx={{ fontSize: 90, mb: 2 }}
        />

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Pago cancelado
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          No se realizó ningún cobro.
          Puedes volver a intentarlo cuando lo desees para obtener el plan Premium.
        </Typography>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() =>
            navigate('/reclutador/buscar-candidatos-por-score')
          }
        >
          Volver
        </Button>
      </Paper>
    </Box>
  );
}