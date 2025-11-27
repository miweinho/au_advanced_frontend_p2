'use client';

import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import LoginPage from './api/auth/login';
import { useAuth } from './ui/AuthProvider';

export default function HomePage() {
  const { token } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If logged in and mounted, show loading during redirect
  if (mounted && token) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Always render LoginPage (consistent server/client)
  // If mounted and has token, the above condition will show loading instead
  return <LoginPage />;
}