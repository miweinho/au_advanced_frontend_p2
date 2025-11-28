'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Stack,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, FitnessCenter, PlayArrow, Repeat, Timer, SportsGymnastics } from '@mui/icons-material';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { WorkoutProgram, Exercise } from '../types/workout';
import ExerciseDialog from '../ExerciseDialog';
import EditWorkoutForm from './EditWorkoutForm';
import { alpha } from '@mui/material/styles';

interface WorkoutDetailsProps {
  program: WorkoutProgram;
  onBack: () => void;
  canEdit?: boolean;
  onDeleted?: (id: number) => void;
}

export default function WorkoutDetails({ program, onBack, canEdit = false, onDeleted }: WorkoutDetailsProps) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  const handleStartWorkout = () => {
    // You can implement the start-workout logic here
    alert(`Starting workout: ${program.name}`);
  };

  const handleSaved = (updated: WorkoutProgram) => {
    console.log('saved', updated);
  };

  const handleDeleteProgram = async () => {
    if (!program?.workoutProgramId) return;
    if (!confirm(`Delete program "${program.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/api/WorkoutPrograms/${program.workoutProgramId}`);
      // notify parent to remove the program from its list
      onDeleted?.(program.workoutProgramId);
      onBack();
    } catch (err) {
      console.error('Failed to delete program', err);
      alert('Failed to delete program.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 3, textTransform: 'none' }}>
          Back to list
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
                label={`${program.exercises?.length || 0} exercises`}
                color="primary"
                variant="filled"
              />
              <Chip
                label="Active"
                color="success"
                variant="outlined"
              />
              <Chip
                label="45-60 min"
                variant="outlined"
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {canEdit && (
              <>
                <Button variant="outlined" onClick={() => setEditing(true)} sx={{ textTransform: 'none' }}>
                  Edit
                </Button>

                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteOutline />}
                  onClick={handleDeleteProgram}
                  disabled={deleting}
                  sx={{ textTransform: 'none' }}
                >
                  {deleting ? <CircularProgress size={18} color="inherit" /> : 'Delete'}
                </Button>
              </>
            )}

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
              Start Workout
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Exercise List */}
      <Grid container spacing={3}>
        {program.exercises?.map((exercise, index) => (
          <Grid size={12} key={exercise.exerciseId || index}>
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
                  {/* Exercise number */}
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

                  {/* Exercise information */}
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

                    {/* Exercise details */}
                    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Repeat sx={{ fontSize: 20, color: 'primary.main' }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Sets
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
                            Repetitions
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
                              Rest
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
                              Difficulty
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {exercise.difficulty}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  {/* Action button */}
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      textTransform: 'none',
                      borderRadius: 2
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Workout summary */}
      {program.exercises && program.exercises.length > 0 && (
        <Card
          sx={{
            mt: 4,
            backgroundColor: alpha('#667eea', 0.03),
            border: `1px solid ${alpha('#667eea', 0.1)}`
          }}
        >
          
        </Card>
      )}

      {/* Exercise details modal */}
      <ExerciseDialog
        exercise={selectedExercise}
        open={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />

      <EditWorkoutForm open={editing} program={program} onClose={() => setEditing(false)} onSaved={handleSaved} />
    </Box>
  );
}