'use client';

import { Container, Typography, Box, Paper } from '@mui/material';
import { BarChart } from '@mui/icons-material';

export default function ProgressPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          My Progress
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Track your progress and achievements
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <BarChart sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Analytics Coming Soon
        </Typography>
        <Typography color="text.secondary">
          Soon you'll see charts and statistics of your progress here.
        </Typography>
      </Paper>
    </Container>
  );
}