'use client';

import { Grid, Paper, Typography, Box, Chip, alpha } from '@mui/material';
import {
  FitnessCenter,
  TrendingUp,
  CalendarToday,
  EmojiEvents,
  AccessTime
} from '@mui/icons-material';
import { WorkoutProgram } from '../../types/workout';
import WorkoutList from '../../../components/shared/workouts/WorkoutList';

interface DashboardContentProps {
  programs: WorkoutProgram[];
}

export default function DashboardContent({ programs }: DashboardContentProps) {
  const totalExercises = programs.reduce((total, program) => total + (program.exercises?.length || 0), 0);
  const completedSessions = 3; // Mock data - replace with real data
  const weeklyGoal = 5;

  return (
    <>
      {/* Welcome header */}
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
          Welcome to your Dashboard! 💪
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Track your progress and manage your workouts
        </Typography>
      </Box>

      {/* Stats grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {/* Active Programs */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 160,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <FitnessCenter sx={{ fontSize: 28, mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Active Programs
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {programs.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total programs
            </Typography>
          </Paper>
        </Grid>

        {/* Total Exercises */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 160,
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(245, 87, 108, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: -30,
                right: -30,
                width: 80,
                height: 80,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUp sx={{ fontSize: 28, mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Total Exercises
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {totalExercises}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Across all programs
            </Typography>
          </Paper>
        </Grid>

        {/* Sessions This Week */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 160,
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(79, 172, 254, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: -40,
                right: -40,
                width: 90,
                height: 90,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarToday sx={{ fontSize: 28, mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Sessions This Week
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {completedSessions}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Workouts completed
            </Typography>
          </Paper>
        </Grid>

        {/* Weekly Goal */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 160,
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(67, 233, 123, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: -35,
                right: -35,
                width: 85,
                height: 85,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmojiEvents sx={{ fontSize: 28, mr: 1.5 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Weekly Goal
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mr: 1 }}>
                {completedSessions}/{weeklyGoal}
              </Typography>
              <Chip
                label={`${Math.round((completedSessions / weeklyGoal) * 100)}%`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {completedSessions >= weeklyGoal ? 'Goal reached! 🎉' : 'Keep it up!'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Next Recommended Workout */}
      {programs.length > 0 && (
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <AccessTime color="primary" sx={{ mr: 2, fontSize: 32 }} />
            <Box>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 0.5 }}>
                Next Recommended Workout
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {programs[0].name} - {programs[0].exercises?.length || 0} exercises
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<FitnessCenter />}
              label={`${programs[0].exercises?.length || 0} exercises`}
              variant="outlined"
            />
            <Chip
              icon={<AccessTime />}
              label="45-60 minutes"
              variant="outlined"
            />
            <Chip
              label="Beginner"
              color="primary"
              variant="filled"
            />
          </Box>
        </Paper>
      )}

      {/* Recent Programs */}
      <Paper
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 2
            }}
          >
            My Workout Programs
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              lineHeight: 1.6
            }}
          >
            Manage your workout programs and track your progress
          </Typography>
        </Box>

        {programs.length > 0 ? (
          <WorkoutList
            programs={programs}
            onProgramSelect={(program) => {
              // Navigate to the details page
              window.location.href = `/client/workouts?program=${program.workoutProgramId}`;
            }}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <FitnessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No programs available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Contact your personal trainer to get a tailored program.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Quick Tip */}
      <Paper
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          backgroundColor: alpha('#667eea', 0.05),
          border: `1px solid ${alpha('#667eea', 0.1)}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{
            backgroundColor: 'primary.main',
            borderRadius: '50%',
            p: 1,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <EmojiEvents sx={{ color: 'white', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              Tip of the Day
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stay hydrated during your workouts! Drink water before, during, and after exercise for better performance.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </>
  );
}