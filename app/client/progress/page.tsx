'use client';

import { Container, Typography, Box, Paper } from '@mui/material';
import { BarChart } from '@mui/icons-material';

export default function ProgressPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Meu Progresso
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Acompanhe sua evolução e conquistas
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <BarChart sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Análises em Desenvolvimento
        </Typography>
        <Typography color="text.secondary">
          Em breve você verá gráficos e estatísticas do seu progresso aqui.
        </Typography>
      </Paper>
    </Container>
  );
}