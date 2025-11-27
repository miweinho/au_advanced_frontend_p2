"use client";

import { useState, useEffect } from "react";
import { api } from '@/lib/api';
import { useAuth } from '@/app/ui/AuthProvider';
import { Container, Typography, Box, Paper, Grid, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import CreateWorkoutForm from "@/app/components/shared/workouts/CreateWorkoutForm";
import WorkoutList from "@/app/components/shared/workouts/WorkoutList";
import WorkoutDetails from "@/app/components/shared/workouts/WorkoutDetails";
import { WorkoutProgram } from "../../client/types/workout";

export default function TrainerWorkoutPage() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(
    null
  );
  const [createOpen, setCreateOpen] = useState(false);

  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const res = await api.get<WorkoutProgram[]>('/api/WorkoutPrograms/trainer');
        setPrograms(res.data || []);
      } catch (err) {
        console.error('Failed to load trainer programs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [token]);

  const handleProgramSelect = (program: WorkoutProgram) => {
    setSelectedProgram(program);
  };

  const handleCreateProgram = () => {
    setCreateOpen(true);
  };

  return (
    <>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Trainer — Exercises
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage and edit workout programs for your clients
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateProgram}
          >
            Create Program
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <WorkoutList
                programs={programs}
                loading={loading}
                onProgramSelect={handleProgramSelect}
                // trainers can edit everything, pass canEdit where supported
                // if WorkoutList supports a prop for edit actions, you can add it here
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 2, height: "100%" }}>
              {selectedProgram ? (
                <WorkoutDetails
                  program={selectedProgram}
                  onBack={() => setSelectedProgram(null)}
                  // show edit controls for trainer
                  canEdit={true}
                />
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <Typography variant="h6" color="text.secondary">
                    Select a program to view and edit details
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <CreateWorkoutForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(created) => {
          // prefer updating local state (if you keep programs state). Fallback: refresh page
          try {
            // if you have setPrograms in scope uncomment and use:
            // setPrograms((p) => [created, ...p]);
          } finally {
            setCreateOpen(false);
            // refresh server-side data / lists
            router.refresh();
          }
        }}
      />
    </>
  );
}
