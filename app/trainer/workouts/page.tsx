"use client";

import { useState, useEffect } from "react";
import { api } from '@/lib/api';
import { useAuth } from '@/app/ui/AuthProvider';
import { Container, Typography, Box, Paper, Grid, Button, Dialog, DialogContent } from "@mui/material";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import CreateWorkoutForm from "@/app/components/shared/workouts/CreateWorkoutForm";
import WorkoutList from "@/app/components/shared/workouts/WorkoutList";
import WorkoutDetails from "@/app/components/shared/workouts/WorkoutDetails";
import { WorkoutProgram } from "../../components/shared/types/workout";

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
    // open details dialog when a program is selected from the list
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
          <Grid size={{ xs: 12, md: 5 }}>
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
        </Grid>
      </Container>

      {/* Popup dialog: show WorkoutDetails as modal when a program is selected */}
      <Dialog
        open={!!selectedProgram}
        onClose={() => setSelectedProgram(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedProgram && (
            <WorkoutDetails
              program={selectedProgram}
              onBack={() => setSelectedProgram(null)}
              canEdit={true}
              onDeleted={(id: number) => {
                // remove deleted program immediately from local list
                setPrograms((prev) => prev.filter((p) => p.workoutProgramId !== id));
                setSelectedProgram(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <CreateWorkoutForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(created) => {
          // append created program to local list so UI is in sync
          setPrograms((prev) => [created, ...prev]);
          setCreateOpen(false);
          setSelectedProgram(created);
        }}
      />
    </>
  );
}
