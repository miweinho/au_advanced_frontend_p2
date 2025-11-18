'use client';

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  alpha
} from '@mui/material';
import {
  ArrowBack,
  FitnessCenter,
  Timer,
  Repeat,
  SportsGymnastics,
  PlayArrow
} from '@mui/icons-material';
import { WorkoutProgram, Exercise } from '../../../types/workout';
import ExerciseDialog from '../ExerciseDialog';

interface WorkoutDetailsProps {
  program: WorkoutProgram;
  onBack: () => void;
}

export default function WorkoutDetails({ program, onBack }: WorkoutDetailsProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleStartWorkout = () => {
    // Aqui podes implementar a lógica para iniciar o treino
    alert(`Iniciando treino: ${program.name}`);
  };

  return (
    <>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={onBack}
          sx={{ mb: 3, textTransform: 'none' }}
        >
          Voltar para lista
        </Button>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              {program.name}
            </Typography>
            {program.description && (
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {program.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<FitnessCenter />}
                label={`${program.exercises?.length || 0} exercícios`}
                color="primary"
                variant="filled"
              />
              <Chip
                label="Ativo"
                color="success"
                variant="outlined"
              />
              <Chip
                label="45-60 min"
                variant="outlined"
              />
            </Box>
          </Box>

          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrow />}
            onClick={handleStartWorkout}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5
            }}
          >
            Iniciar Treino
          </Button>
        </Box>
      </Box>

      {/* Lista de Exercícios */}
      <Grid container spacing={3}>
        {program.exercises?.map((exercise, index) => (
          <Grid item xs={12} key={exercise.exerciseId || index}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  borderColor: 'primary.main'
                }
              }}
              onClick={() => handleExerciseClick(exercise)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                  {/* Número do Exercício */}
                  <Avatar
                    sx={{
                      bgcolor: 'primary.main',
                      width: 50,
                      height: 50,
                      fontWeight: 600
                    }}
                  >
                    {index + 1}
                  </Avatar>

                  {/* Informações do Exercício */}
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                      {exercise.name}
                    </Typography>

                    {exercise.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {exercise.description}
                      </Typography>
                    )}

                    {/* Detalhes do Exercício */}
                    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Repeat sx={{ fontSize: 20, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Séries
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {exercise.sets}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FitnessCenter sx={{ fontSize: 20, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Repetições
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {exercise.repetitions}
                          </Typography>
                        </Box>
                      </Box>

                      {exercise.restTime && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Timer sx={{ fontSize: 20, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Descanso
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {exercise.restTime}s
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      {exercise.difficulty && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SportsGymnastics sx={{ fontSize: 20, color: 'primary.main' }} />
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              Dificuldade
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {exercise.difficulty}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Botão de Ação */}
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Resumo do Treino */}
      {program.exercises && program.exercises.length > 0 && (
        <Card
          sx={{
            mt: 4,
            backgroundColor: alpha('#667eea', 0.03),
            border: `1px solid ${alpha('#667eea', 0.1)}`
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Resumo do Treino
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total de Exercícios
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {program.exercises.length}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Séries Totais
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {program.exercises.reduce((total, ex) => total + ex.sets, 0)}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tempo Estimado
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    45-60 min
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Nível
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    Iniciante
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Modal de Detalhes do Exercício */}
      <ExerciseDialog
        exercise={selectedExercise}
        open={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </>
  );
}