'use client';

import {
  Drawer as MuiDrawer,
  List,
  Toolbar,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  FitnessCenter as WorkoutIcon,
  CalendarMonth as ScheduleIcon,
  BarChart as ProgressIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import theme from '@/src/theme';

interface DrawerProps {
  open: boolean;
  toggleDrawer: () => void;
}

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/client' },
  { text: 'Meus Treinos', icon: <WorkoutIcon />, path: '/client/workouts' },
  { text: 'Agenda', icon: <ScheduleIcon />, path: '/client/schedule' },
  { text: 'Progresso', icon: <ProgressIcon />, path: '/client/progress' },
  { text: 'Definições', icon: <SettingsIcon />, path: '/client/settings' },
];

export default function Drawer({ open, toggleDrawer }: DrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Evitar hydration usando useEffect
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Durante SSR, não renderizar lógica que depende do client
  if (!mounted) {
    return (
      <MuiDrawer
        variant="permanent"
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            boxSizing: 'border-box',
            ...(!open && {
              overflowX: 'hidden',
              width: theme => theme.spacing(7),
              [theme.breakpoints.up('sm')]: {
                width: theme => theme.spacing(9),
              },
            }),
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List component="nav">
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </MuiDrawer>
    );
  }

  return (
    <MuiDrawer
      variant="permanent"
      open={open}
      sx={{
        '& .MuiDrawer-paper': {
          position: 'relative',
          whiteSpace: 'nowrap',
          width: drawerWidth,
          transition: (theme) =>
            theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          boxSizing: 'border-box',
          ...(!open && {
            overflowX: 'hidden',
            transition: (theme) =>
              theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            width: theme => theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
              width: theme => theme.spacing(9),
            },
          }),
        },
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      />

      <Divider />

      <List component="nav">
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon sx={{
                color: pathname === item.path ? 'primary.main' : 'inherit'
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </MuiDrawer>
  );
}