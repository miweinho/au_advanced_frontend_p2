'use client';

import React, { useState, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import { useAuth } from '../ui/AuthProvider';
import { UIProvider, useUI } from './ui/UIContext';
import AppBar from './shared/AppBar';
import Drawer from './shared/Drawer';

/*
  Shell
  - Provides UI context to pages
  - Renders AppBar + Drawer only when authenticated and UI context allows it.
*/
function ShellInner({ children }: { children: React.ReactNode }) {
  const { showShell } = useUI();
  const { token, role } = useAuth();
  const [mounted, setMounted] = useState(false);

  const [open, setOpen] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem('drawerOpen') === 'true' : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleDrawer = () => {
    const next = !open;
    setOpen(next);
    try {
      if (typeof window !== 'undefined') localStorage.setItem('drawerOpen', String(next));
    } catch {}
  };

  // Prevent hydration mismatch: wait for client-side mount
  if (!mounted) {
    return <>{children}</>;
  }

  // If not authenticated: render children (login page) without shell
  if (!token || !role) return <>{children}</>;

  // If a page set showShell = false, render children only
  if (!showShell) return <>{children}</>;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar open={open} toggleDrawer={toggleDrawer} />
      <Drawer open={open} toggleDrawer={toggleDrawer} />

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
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

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <UIProvider>
      <ShellInner>{children}</ShellInner>
    </UIProvider>
  );
}