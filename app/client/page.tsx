'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import axios from 'axios';
import { WorkoutProgram } from './types/workout';
import DashboardContent from './components/Dashboard/DashboardContent';
import LoadingState from './components/LoadingState';

export default function DashboardPage() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Garantir que só executa no client
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

  // Durante SSR, mostrar loading genérico
  if (!mounted) {
    return <LoadingState />;
  }

  if (loading) {
    return <LoadingState />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <DashboardContent programs={programs} />
    </Container>
  );
}