'use client';

import { Box, Typography, Button } from '@mui/material';
import { FitnessCenter } from '@mui/icons-material';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "Nenhum programa disponível",
  message = "Entre em contato com seu personal trainer para criar um programa personalizado.",
  actionText = "Solicitar Programa",
  onAction
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        backgroundColor: '#f5f5f5',
        borderRadius: 3,
        p: 4
      }}
    >
      <Box textAlign="center">
        <FitnessCenter sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.7 }} />
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
          {message}
        </Typography>
        {onAction && (
          <Button
            variant="contained"
            size="large"
            onClick={onAction}
          >
            {actionText}
          </Button>
        )}
      </Box>
    </Box>
  );
}