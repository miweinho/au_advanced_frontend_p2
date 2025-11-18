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
import WorkoutList from '../workouts/WorkoutList';

interface DashboardContentProps {
  programs: WorkoutProgram[];
}

export default function DashboardContent({ programs }: DashboardContentProps) {
  const totalExercises = programs.reduce((total, program) => total + (program.exercises?.length || 0), 0);
  const completedSessions = 3; // Mock data - podes substituir por dados reais
  const weeklyGoal = 5;

  return (
    <>
      {/* Header com Boas-vindas */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{
          fontWeight: 700,
          color: 'text.primary',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Bem-vindo ao seu Dashboard! 💪
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Acompanhe seu progresso e gerencie seus treinos
        </Typography>
      </Box>

      {/* Estatísticas em Grid */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {/* Programas Ativos */}
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
                Programas Ativos
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {programs.length}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Total de programas
            </Typography>
          </Paper>
        </Grid>

        {/* Total Exercícios */}
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
                Total Exercícios
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {totalExercises}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Em todos os programas
            </Typography>
          </Paper>
        </Grid>

        {/* Sessões Esta Semana */}
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
                Sessões Esta Semana
              </Typography>
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
              {completedSessions}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Treinos completados
            </Typography>
          </Paper>
        </Grid>

        {/* Meta Semanal */}
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
                Meta Semanal
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
              {completedSessions >= weeklyGoal ? 'Meta atingida! 🎉' : 'Continue assim!'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Próximo Treino */}
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
                Próximo Treino Recomendado
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {programs[0].name} - {programs[0].exercises?.length || 0} exercícios
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<FitnessCenter />}
              label={`${programs[0].exercises?.length || 0} exercícios`}
              variant="outlined"
            />
            <Chip
              icon={<AccessTime />}
              label="45-60 minutos"
              variant="outlined"
            />
            <Chip
              label="Iniciante"
              color="primary"
              variant="filled"
            />
          </Box>
        </Paper>
      )}

      {/* Programas Recentes */}
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
            Meus Programas de Treino
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 600,
              lineHeight: 1.6
            }}
          >
            Gerencie seus programas de treino e acompanhe seu progresso
          </Typography>
        </Box>

        {programs.length > 0 ? (
          <WorkoutList
            programs={programs}
            onProgramSelect={(program) => {
              // Navegação para a página de detalhes
              window.location.href = `/client/workouts?program=${program.workoutProgramId}`;
            }}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <FitnessCenter sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhum programa disponível
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Entre em contato com seu personal trainer para criar um programa personalizado.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Dica Rápida */}
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
              Dica do Dia
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mantenha a hidratação durante os treinos! Beba água antes, durante e após o exercício para melhor performance.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </>
  );
}