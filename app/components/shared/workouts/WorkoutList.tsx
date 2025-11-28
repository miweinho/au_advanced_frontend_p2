'use client';

import { Grid } from '@mui/material';
import { WorkoutProgram } from '../types/workout';
import WorkoutCard from './WorkoutCard';

interface WorkoutListProps {
  programs: WorkoutProgram[];
  onProgramSelect: (program: WorkoutProgram) => void;
  loading?: boolean;
}

export default function WorkoutList({ programs, onProgramSelect, loading }: WorkoutListProps) {
  if (loading) {
    return <Grid container spacing={3} />;
  }

  return (
    <Grid container spacing={3}>
      {programs.map(program => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={program.workoutProgramId}>
          <WorkoutCard
            program={program}
            onSelect={onProgramSelect}
          />
        </Grid>
      ))}
    </Grid>
  );
}