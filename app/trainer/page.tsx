'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  alpha
} from '@mui/material';
import { People, FitnessCenter, Schedule } from '@mui/icons-material';
import axios from 'axios';
import { useUI } from '../components/ui/UIContext';
import { WorkoutProgram } from '../client/types/workout';

export default function TrainerWelcomePage() {
  const { setShowShell, setTitle } = useUI();
  const [clientsCount, setClientsCount] = useState<number | null>(null);
  const [newestWorkouts, setNewestWorkouts] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setShowShell(true);
    setTitle('Trainer Home');

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      // Shell should normally protect this route; nothing to do here
      setLoading(false);
      return;
    }

    // Fetch assigned clients count
    // TODO: replace the endpoint with the real trainer/clients count endpoint
    axios
      .get('/api/trainer/clients/count', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // expected: { count: number } — adapt to your API
        setClientsCount(res.data?.count ?? null);
      })
      .catch(() => {
        // fallback: leave null or 0
        setClientsCount(null);
      });

    // Fetch newest workouts created by this trainer
    // TODO: replace the endpoint with the real trainer workouts endpoint and adjust response shape
    axios
      .get('/api/trainer/workouts?limit=5', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        // expected: array of WorkoutProgram
        setNewestWorkouts(res.data ?? []);
      })
      .catch(() => {
        setNewestWorkouts([]);
      })
      .finally(() => setLoading(false));
  }, [setShowShell, setTitle]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Welcome, Trainer
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Overview of your clients and recent workouts
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 6 }} alignItems="stretch">
        {/* Assigned clients count (styled like dashboard card) */}
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <People sx={{ fontSize: 28, mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Assigned Clients
              </Typography>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {clientsCount === null ? '—' : clientsCount}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Clients assigned to you
            </Typography>
          </Paper>
        </Grid>

        {/* Placeholder stat for quick visual parity with dashboard */}
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              height: '100%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(245, 87, 108, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FitnessCenter sx={{ fontSize: 28, mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Your Programs
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {newestWorkouts.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Recently created by you
            </Typography>
          </Paper>
        </Grid>

        {/* filler cards to keep layout similar */}
        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <Paper sx={{ p: 3, flex: 1, height: '100%', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Schedule sx={{ fontSize: 28, mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Weekly Sessions
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              0
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Placeholder
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex' }}>
          <Paper sx={{ p: 3, flex: 1, height: '100%', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FitnessCenter sx={{ fontSize: 28, mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Active Clients
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              —
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Placeholder
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Newest workouts list */}
      <Paper
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Newest Workouts
        </Typography>

        {loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : newestWorkouts.length === 0 ? (
          <Typography color="text.secondary">No recent workouts found.</Typography>
        ) : (
          <List>
            {newestWorkouts.map((p) => (
              <ListItem key={p.workoutProgramId ?? p.name}>
                <ListItemText
                  primary={p.name}
                  secondary={p.description ?? 'No description'}
                />
                <Chip label={p.exercises?.length ?? 0} size="small" sx={{ ml: 2 }} />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
}