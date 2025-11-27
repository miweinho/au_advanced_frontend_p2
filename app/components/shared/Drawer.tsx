'use client';

import {
  Drawer as MuiDrawer,
  List,
  Toolbar,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton
} from '@mui/material';
import { Dashboard, FitnessCenter, CalendarMonth, BarChart, Settings, People, Group, ChevronLeft, ChevronRight, SportsGymnastics } from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

type MenuItem = { text: string; icon: React.ReactNode; path: string };

interface DrawerProps {
  open: boolean;
  toggleDrawer?: () => void;
  menuItems?: MenuItem[];
}

const drawerWidth = 240;

function getMenuItemsByRole(role: string | null): MenuItem[] {
  const clientMenu: MenuItem[] = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/client' },
    { text: 'My Workouts', icon: <FitnessCenter />, path: '/client/workouts' },
    { text: 'Trainers', icon: <People />, path: '/client/trainers' },
    { text: 'Schedule', icon: <CalendarMonth />, path: '/client/schedule' },
    { text: 'Progress', icon: <BarChart />, path: '/client/progress' },
    { text: 'Settings', icon: <Settings />, path: '/client/settings' },
  ];

  const trainerMenu: MenuItem[] = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/trainer' },
    { text: 'Clients', icon: <Group />, path: '/trainer/clients' },
    { text: 'Schedule', icon: <CalendarMonth />, path: '/trainer/schedule' },
    { text: 'Workouts', icon: <FitnessCenter />, path: '/trainer/workouts' },
    { text: 'Exercises', icon: <SportsGymnastics />, path: '/trainer/exercises' },
    
  ];

  const managerMenu: MenuItem[] = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/manager' },
    { text: 'PT List', icon: <People />, path: '/manager/pt-list' },
    { text: 'Add PT', icon: <Plus />, path: '/manager/create-pt' },
  ];

  if (role === 'PersonalTrainer') return trainerMenu;
  if (role === 'Manager') return managerMenu;
  return clientMenu;
}

export default function Drawer({ open: openProp, toggleDrawer, menuItems: menuItemsProp = [] }: DrawerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // internal open state persisted to localStorage; initialize from storage if present
  const [internalOpen, setInternalOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return openProp;
    const stored = localStorage.getItem('drawerOpen');
    if (stored !== null) return stored === 'true';
    return openProp;
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync prop changes (parent toggle) into local storage + internal state
  useEffect(() => {
    if (typeof window === 'undefined') return;
    setInternalOpen(openProp);
    try {
      localStorage.setItem('drawerOpen', String(openProp));
    } catch {
      // ignore storage errors
    }
  }, [openProp]);

  const handleNavigation = (path: string) => router.push(path);

  const handleToggle = () => {
    const next = !internalOpen;
    if (toggleDrawer) toggleDrawer();
    setInternalOpen(next);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('drawerOpen', String(next));
      } catch {
        // ignore
      }
    }
  };

  // choose menu items: prefer explicit prop, otherwise compute by role
  const effectiveMenuItems = (menuItemsProp && menuItemsProp.length > 0)
    ? menuItemsProp
    : getMenuItemsByRole(typeof window !== 'undefined' ? localStorage.getItem('role') : null);

  // minimal drawer during SSR/hydration to avoid client-only logic
  if (!mounted) {
    return (
      <MuiDrawer
        variant="permanent"
        open={internalOpen}
        sx={(theme) => ({
          '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            boxSizing: 'border-box',
            ...(!internalOpen && {
              overflowX: 'hidden',
              width: theme.spacing(7),
              [theme.breakpoints.up('sm')]: {
                width: theme.spacing(9),
              },
            }),
          },
        })}
      >
        <Toolbar />
        <Divider />
        <List component="nav">
          {effectiveMenuItems.map(item => (
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
      open={internalOpen}
      sx={(theme) => ({
        '& .MuiDrawer-paper': {
          position: 'relative',
          whiteSpace: 'nowrap',
          width: drawerWidth,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          boxSizing: 'border-box',
          ...(!internalOpen && {
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up('sm')]: {
              width: theme.spacing(9),
            },
          }),
        },
      })}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={handleToggle} size="small" aria-label="toggle drawer">
          {internalOpen ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Toolbar>

      <Divider />

      <List component="nav">
        {effectiveMenuItems.map(item => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                  '&:hover': { backgroundColor: 'primary.light' },
                },
              }}
            >
              <ListItemIcon sx={{ color: pathname === item.path ? 'primary.main' : 'inherit' }}>
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