import { CheckCircle } from '@mui/icons-material';
import { Box, Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
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
        <CheckCircle
          color="success"
          sx={{ fontSize: 90, mb: 2 }}
        />

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          ¡Pago realizado con éxito!
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Tu empresa ahora cuenta con el plan <b>Premium</b>.
          Ya puedes utilizar todas las funcionalidades exclusivas de WorkHive.
        </Typography>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() =>
            navigate('/reclutador/buscar-candidatos-por-score')
          }
        >
          Ir a funciones Premium
        </Button>
      </Paper>
    </Box>
  );
}