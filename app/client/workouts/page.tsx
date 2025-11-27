'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid } from '@mui/material';
import { FitnessCenter, Schedule, TrendingUp } from '@mui/icons-material';
import { api } from '@/lib/api';
import { useAuth } from '@/app/ui/AuthProvider';
import { WorkoutProgram } from '../types/workout';
import WorkoutList from '../../components/shared/workouts/WorkoutList';
import WorkoutDetails from '../../components/shared/workouts/WorkoutDetails';
import EmptyState from '../../components/shared/EmptyState';
import LoadingState from '../../components/shared/LoadingState';

export default function WorkoutsPage() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.get<WorkoutProgram[]>('/api/WorkoutPrograms')
      .then(res => {
        setPrograms(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err?.response ?? err);
        setLoading(false);
      });
  }, []);

  const handleBackToList = () => {
    setSelectedProgram(null);
  };

  // During SSR/hydration show loading
  if (!mounted) {
    return <LoadingState />;
  }

  if (loading) {
    return <LoadingState />;
  }

  if (selectedProgram) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <WorkoutDetails
          program={selectedProgram}
          onBack={handleBackToList}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          My Workout Programs
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          Choose a program to explore exercises and start your workout
        </Typography>
      </Box>

      {/* Quick stats */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <FitnessCenter sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight={800} color="primary.main">
                  {programs.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Programs
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <TrendingUp sx={{ fontSize: 32, color: 'secondary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight={800} color="secondary.main">
                  {programs.reduce((total, program) => total + (program.exercises?.length || 0), 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Exercises
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              <Schedule sx={{ fontSize: 32, color: 'success.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" fontWeight={800} color="success.main">
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Workouts / week
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Program list */}
      {programs.length === 0 ? (
        <EmptyState />
      ) : (
        <WorkoutList
          programs={programs}
          onProgramSelect={setSelectedProgram}
        />
      )}
    </Container>
  );
}