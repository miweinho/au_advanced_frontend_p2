'use client';

import { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import { WorkoutProgram } from '../../types/workout';
import AppBar from './AppBar';
import Drawer from './Drawer';
import MainContent from './MainContent';

const drawerWidth = 240;

interface DashboardLayoutProps {
  programs: WorkoutProgram[];
  onProgramSelect: (program: WorkoutProgram) => void;
  selectedProgram: WorkoutProgram | null;
  onBackToList: () => void;
}

export default function DashboardLayout({
  programs,
  onProgramSelect,
  selectedProgram,
  onBackToList
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar open={open} toggleDrawer={toggleDrawer} />
      <Drawer open={open} toggleDrawer={toggleDrawer} />

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <MainContent
          programs={programs}
          selectedProgram={selectedProgram}
          onProgramSelect={onProgramSelect}
          onBackToList={onBackToList}
        />
      </Box>
    </Box>
  );
}