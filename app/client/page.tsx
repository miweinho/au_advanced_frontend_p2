'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Button, Box } from '@mui/material';
import axios from 'axios';

export default function ClientPrograms() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<any | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("https://assignment2.swafe.dk/api/WorkoutPrograms/my", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPrograms(res.data))
    .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (programs.length === 1) {
      setSelectedProgram(programs[0]);
    }
  }, [programs]);

  if (programs.length === 0) {
    return <Typography>Sem programas disponíveis.</Typography>;
  }

  if (!selectedProgram) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>Os meus Programas</Typography>

        {programs.map(p => (
          <Card key={p.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{p.name}</Typography>
              <Button variant="contained" sx={{ mt: 1 }}
                onClick={() => setSelectedProgram(p)}
              >
                Ver Programa
              </Button>
            </CardContent>
          </Card>
        ))}
      </Container>
    );
  }

  return (
    <ClientProgramDetails program={selectedProgram} />
  );
}

function ClientProgramDetails({ program }: { program: any }) {
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`https://assignment2.swafe.dk/api/Exercises/program/${program.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setExercises(res.data))
    .catch(err => console.error(err));
  }, [program]);

  return (
    <Container>
      <Typography variant="h4" sx={{ mt: 3 }}>{program.name}</Typography>

      {exercises.map(ex => (
        <Card key={ex.id} sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">{ex.name}</Typography>
            <Typography>{ex.description}</Typography>
            <Box sx={{ mt: 1 }}>
              <strong>Sets:</strong> {ex.sets} <br />
              <strong>Reps/Tempo:</strong> {ex.repetitionsOrTime}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
