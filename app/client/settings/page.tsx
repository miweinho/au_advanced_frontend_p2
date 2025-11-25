'use client';

import { Container, Typography, Box, Paper } from '@mui/material';
import { Settings } from '@mui/icons-material';

export default function SettingsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Definições
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Gerencie suas preferências e conta
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <Settings sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Configurações em Desenvolvimento
        </Typography>
        <Typography color="text.secondary">
          Em breve você poderá personalizar sua experiência aqui.
        </Typography>
      </Paper>
    </Container>
  );
}