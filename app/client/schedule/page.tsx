'use client';

import { Container, Typography, Box, Paper } from '@mui/material';
import { CalendarMonth } from '@mui/icons-material';

export default function SchedulePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Training Schedule
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Organize your workouts and keep track of your calendar
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <CalendarMonth sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Calendar Under Development
        </Typography>
        <Typography color="text.secondary">
          Soon you'll be able to schedule and track your workouts here.
        </Typography>
      </Paper>
    </Container>
  );
}