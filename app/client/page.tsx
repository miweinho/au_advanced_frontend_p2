'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  Chip,
  AppBar,
  Toolbar,
  Avatar
} from '@mui/material';
import {
  FitnessCenter,
  ArrowBack,
  AccessTime,
  SportsGymnastics
} from '@mui/icons-material';
import axios from 'axios';

export default function ClientPrograms() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  useEffect(() => {
    if (programs.length === 1) {
      setSelectedProgram(programs[0]);
    }
  }, [programs]);

  const handleBackToList = () => {
    setSelectedProgram(null);
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <Typography variant="h6" color="text.secondary">
            Carregando seus programas...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (programs.length === 0) {
    return (
      <Container>
        <Box textAlign="center" py={10}>
          <SportsGymnastics sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Nenhum programa disponível
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Entre em contato com seu personal trainer para criar um programa personalizado.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (selectedProgram) {
    return (
      <ClientProgramDetails
        program={selectedProgram}
        onBack={handleBackToList}
      />
    );
  }

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Toolbar>
          <FitnessCenter sx={{ color: 'primary.main', mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 600 }}>
            Fitness App
          </Typography>
          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
            <Typography variant="body2" sx={{ color: 'white' }}>C</Typography>
          </Avatar>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6, mt: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
            Meus Programas de Treino
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Escolha um programa para ver os exercícios detalhados e começar seu treino
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {programs.map(program => (
            <Grid item xs={12} md={6} lg={4} key={program.workoutProgramId}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
                onClick={() => setSelectedProgram(program)}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <FitnessCenter color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                      {program.name}
                    </Typography>
                  </Box>

                  {program.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {program.description}
                    </Typography>
                  )}

                  <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
                    <Chip
                      icon={<SportsGymnastics />}
                      label={`${program.exercises?.length || 0} exercícios`}
                      size="small"
                      variant="outlined"
                    />
                    <Button
                      variant="contained"
                      size="small"
                      endIcon={<ArrowBack sx={{ transform: 'rotate(180deg)' }} />}
                    >
                      Ver Detalhes
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

function ClientProgramDetails({ program, onBack }: { program: any; onBack?: () => void }) {
  return (
    <>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <Toolbar>
          <Button
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{ color: 'text.primary', mr: 2 }}
          >
            Voltar
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 600 }}>
            {program.name}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
            {program.name}
          </Typography>

          {program.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {program.description}
            </Typography>
          )}

          <Box sx={{ mb: 4 }}>
            <Chip
              icon={<SportsGymnastics />}
              label={`${program.exercises?.length || 0} exercícios no total`}
              color="primary"
              variant="filled"
              sx={{ mb: 2 }}
            />
          </Box>

          <Grid container spacing={3}>
            {program.exercises?.map((ex: any, index: number) => (
              <Grid item xs={12} key={ex.exerciseId || index}>
                <Card>
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                          {index + 1}
                        </Typography>
                      </Avatar>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {ex.name}
                        </Typography>

                        {ex.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {ex.description}
                          </Typography>
                        )}

                        <Box display="flex" gap={3} flexWrap="wrap">
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <FitnessCenter fontSize="small" color="primary" />
                            <Typography variant="body2" fontWeight={500}>
                              Sets: {ex.sets}
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={0.5}>
                            <AccessTime fontSize="small" color="primary" />
                            <Typography variant="body2" fontWeight={500}>
                              Reps: {ex.repetitions}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}