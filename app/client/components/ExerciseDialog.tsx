'use client';

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Grid,
  Card,
  Divider
} from '@mui/material';
import {
  Close,
  Repeat,
  FitnessCenter,
  Timer,
  SportsGymnastics,
  Info
} from '@mui/icons-material';
import { Exercise } from '../types/workout';

interface ExerciseDialogProps {
  exercise: Exercise | null;
  open: boolean;
  onClose: () => void;
}

/*
  ExerciseDialog
  - Shows exercise details (description, stats, instructions)
  - All labels and comments translated to English
*/
export default function ExerciseDialog({ exercise, open, onClose }: ExerciseDialogProps) {
  if (!exercise) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)'
        }
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {exercise.name}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        {/* Description */}
        {exercise.description && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Info color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Description
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {exercise.description}
            </Typography>
          </Box>
        )}

        <Divider sx={{ mb: 4 }} />

        {/* Exercise statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <Repeat sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight={700}>
                {exercise.sets}
              </Typography>
              <Typography variant="body2">
                Sets
              </Typography>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                p: 3,
                textAlign: 'center',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white'
              }}
            >
              <FitnessCenter sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight={700}>
                {exercise.repetitions}
              </Typography>
              <Typography variant="body2">
                Repetitions
              </Typography>
            </Card>
          </Grid>

          {exercise.restTime && (
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white'
                }}
              >
                <Timer sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {exercise.restTime}s
                </Typography>
                <Typography variant="body2">
                  Rest
                </Typography>
              </Card>
            </Grid>
          )}

          {exercise.difficulty && (
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  p: 3,
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white'
                }}
              >
                <SportsGymnastics sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>
                  {exercise.difficulty}
                </Typography>
                <Typography variant="body2">
                  Difficulty
                </Typography>
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Instructions */}
        {exercise.instructions && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SportsGymnastics color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Execution Instructions
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {exercise.instructions}
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}