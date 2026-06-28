import { useEffect, useState } from 'react';
import { Button, CircularProgress, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

import { getMyCompany } from 'services/companyService';
import { createCheckoutSession } from 'services/subscriptionService';

export default function PremiumGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    loadCompany();
  }, []);

  const loadCompany = async () => {
    try {
      const company = await getMyCompany();
      setIsPremium(company.data.subscriptionPlan === 'PREMIUM');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPremium = async () => {
    try {
      const checkout = await createCheckoutSession();

      window.location.href = checkout.sessionUrl;
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!isPremium) {
    return (
      <MainCard title="Plan Premium">
        <Typography variant="h3" gutterBottom>
          Esta función está disponible únicamente para empresas Premium.
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Compra el plan Premium para acceder a esta funcionalidad.
        </Typography>

        <Button
          variant="contained"
          onClick={handleBuyPremium}
        >
          Comprar Premium
        </Button>
      </MainCard>
    );
  }

  return children;
}