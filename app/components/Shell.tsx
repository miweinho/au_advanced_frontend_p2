'use client';

import React, { useEffect, useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { UIProvider, useUI } from './ui/UIContext';
import AppBar from './shared/AppBar';
import Drawer from './shared/Drawer';

/*
  Shell
  - Provides UI context to pages
  - Protects /client, /trainer, /manager routes by redirecting to '/'
    when there is no token/role available.
  - Renders AppBar + Drawer only when authenticated and UI context allows it.
*/
function ShellInner({ children }: { children: React.ReactNode }) {
  const { showShell } = useUI();
  const router = useRouter();
  const pathname = usePathname();

  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem('drawerOpen') === 'true' : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const storedRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    setAuthed(!!token);
    setRole(storedRole);
    setChecked(true);
  }, []);

  // Redirect unauthenticated users away from protected routes
  useEffect(() => {
    if (!checked) return;
    const isProtected =
      pathname?.startsWith('/client') ||
      pathname?.startsWith('/trainer') ||
      pathname?.startsWith('/manager');

    if (isProtected && !authed) {
      router.replace('/');
    }
  }, [checked, authed, pathname, router]);

  const toggleDrawer = () => {
    const next = !open;
    setOpen(next);
    try {
      if (typeof window !== 'undefined') localStorage.setItem('drawerOpen', String(next));
    } catch {}
  };

  if (!checked) return null;

  // If not authenticated or role missing: render children (login) without shell
  if (!authed || !role) return <>{children}</>;

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