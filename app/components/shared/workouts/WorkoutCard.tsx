'use client';

import { Card, CardContent, Typography, Box, Chip, Button, alpha } from '@mui/material';
import { FitnessCenter, ArrowForward, Schedule } from '@mui/icons-material';
import { WorkoutProgram } from '../../../client/types/workout';

interface WorkoutCardProps {
  program: WorkoutProgram;
  onSelect: (program: WorkoutProgram) => void;
}

export default function WorkoutCard({ program, onSelect }: WorkoutCardProps) {
  const exerciseCount = program.exercises?.length || 0;

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        backgroundColor: 'background.paper',
        borderRadius: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }
      }}
      onClick={() => onSelect(program)}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{
            backgroundColor: alpha('#667eea', 0.08),
            borderRadius: 2,
            p: 1.5,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FitnessCenter sx={{ color: 'primary.main', fontSize: 20 }} />
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
              {program.name}
            </Typography>
            {program.description && (
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                {program.description}
              </Typography>
            )}
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Chip
            icon={<Schedule />}
            label={`${exerciseCount} exercises`}
            size="small"
            variant="outlined"
            sx={{
              backgroundColor: alpha('#667eea', 0.03),
              borderColor: alpha('#667eea', 0.1),
            }}
          />
        </Box>

        {/* Action Button */}
        <Button
          fullWidth
          variant="outlined"
          endIcon={<ArrowForward />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            py: 1
          }}
          onClick={() => onSelect(program)}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}