'use client';

import { Container, Typography, Box, Paper } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';

export default function SchedulePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Agenda de Treinos
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Organize seus treinos e acompanhe seu calendário
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <CalendarMonth sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Calendário em Desenvolvimento
        </Typography>
        <Typography color="text.secondary">
          Em breve você poderá agendar e acompanhar seus treinos aqui.
        </Typography>
      </Paper>
    </Container>
  );
}