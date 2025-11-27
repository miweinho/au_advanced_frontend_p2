'use client';

import { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { api } from '@/lib/api';
import { useUI } from '../components/ui/UIContext';
import { WorkoutProgram } from '../components/shared/types/workout';
import DashboardContent from './components/Dashboard/DashboardContent';
import LoadingState from '../components/shared/LoadingState';

export default function DashboardPage() {
  const pageTitle = "Workout Dashboard";
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const { setShowShell, setTitle } = useUI();

  // Ensure this runs only on the client
  useEffect(() => {
    setShowShell(true);
    setTitle(pageTitle);

    // Shell should guarantee auth; we simply read token and fetch data
    setLoading(true);
    api.get<WorkoutProgram[]>('/api/WorkoutPrograms')
      .then(res => setPrograms(res.data || []))
      .catch(err => console.error(err?.response ?? err))
      .finally(() => setLoading(false));
  }, [setShowShell, setTitle]);

  // During SSR, show a generic loading state
  if (loading) return <LoadingState />;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <DashboardContent programs={programs} />
    </Container>
  );
}