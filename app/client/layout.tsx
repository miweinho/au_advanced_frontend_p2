'use client';

import { useState, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import AppBar from './components/Dashboard/AppBar';
import Drawer from './components/Dashboard/Drawer';

const drawerWidth = 240;

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Garantir que o estado só é definido no client
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Durante SSR, usar estado padrão sem interatividade
  if (!mounted) {
    return (
      <Box sx={{ display: 'flex' }}>
        <AppBar open={true} toggleDrawer={toggleDrawer} />
        <Drawer open={true} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) => theme.palette.grey[50],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar open={open} toggleDrawer={toggleDrawer} />
      <Drawer open={open} toggleDrawer={toggleDrawer} />

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[50]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}