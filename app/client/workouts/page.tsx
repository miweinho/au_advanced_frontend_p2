'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Chip } from '@mui/material';
import { FitnessCenter, Schedule, TrendingUp } from '@mui/icons-material';
import axios from 'axios';
import { WorkoutProgram } from '../types/workout';
import WorkoutList from '../components/workouts/WorkoutList';
import WorkoutDetails from '../components/workouts/WorkoutDetails';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
export default function WorkoutsPage() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    axios.get("https://assignment2.swafe.dk/api/WorkoutPrograms", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/plain"
      }
    })
    .then(res => {
      setPrograms(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleBackToList = () => {
    setSelectedProgram(null);
  };

  // Durante SSR, mostrar loading
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
          Meus Programas de Treino
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          Escolha um programa para explorar os exercícios e começar seu treino
        </Typography>
      </Box>

      {/* Estatísticas Rápidas */}
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
                  Programas
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
                  Exercícios
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
                  Treinos/Semana
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Lista de Programas */}
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