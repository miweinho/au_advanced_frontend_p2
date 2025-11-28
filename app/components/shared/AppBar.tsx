'use client';

import { AppBar as MuiAppBar, Toolbar, Typography, IconButton, Badge, Tooltip } from '@mui/material';
import { Menu as MenuIcon, FitnessCenter, Notifications as NotificationsIcon } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { useUI } from '../ui/UIContext';
import { useAuth } from '@/app/ui/AuthProvider';

interface AppBarProps {
  open: boolean;
  toggleDrawer: () => void;
}

const drawerWidth = 240;

export default function AppBar({ open, toggleDrawer }: AppBarProps) {
  const router = useRouter();
  const { title } = useUI();
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
      localStorage.removeItem('drawerOpen');
    } catch {
      // ignore storage errors
    }
    router.replace('/');
  };

  return (
    <MuiAppBar
      position="absolute"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        transition: (theme) =>
          theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        ...(open && {
          marginLeft: drawerWidth,
          width: `calc(100% - ${drawerWidth}px)`,
          transition: (theme) =>
            theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
        }),
      }}
    >
      <Toolbar sx={{ pr: '24px' }}>
        <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer} sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}>
          <MenuIcon />
        </IconButton>

        <FitnessCenter sx={{ mr: 2 }} />

        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          {title}
        </Typography>

        <IconButton color="inherit" aria-label="notifications">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Tooltip title="Logout">
          <IconButton color="inherit" aria-label="logout" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </MuiAppBar>
  );
}