'use client';

import { Container, Typography, Box, Paper } from '@mui/material';
import { Settings } from '@mui/icons-material';

export default function SettingsPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Settings
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your preferences and account
        </Typography>
      </Box>

      <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
        <Settings sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Settings Under Development
        </Typography>
        <Typography color="text.secondary">
          Soon you'll be able to customize your experience here.
        </Typography>
      </Paper>
    </Container>
  );
}