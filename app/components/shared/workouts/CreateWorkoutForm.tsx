'use client';

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { api } from "@/lib/api";
import { WorkoutProgram, Exercise } from "@/app/components/shared/types/workout";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

type ClientItem = {
  userId: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string | null;
  personalTrainerId?: number | null;
  accountType?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (created: WorkoutProgram) => void;
};

export default function CreateWorkoutForm({ open, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clients, setClients] = useState<ClientItem[]>([]);
  // keep select values as strings to avoid NaN issues with MUI Select
  const [clientId, setClientId] = useState<string>("");

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseToAdd, setExerciseToAdd] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingLists, setLoadingLists] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // compute available exercises (exclude already selected)
  const availableExercises = useMemo(
    () => exercises.filter((e) => !selectedExercises.some((s) => s.exerciseId === e.exerciseId)),
    [exercises, selectedExercises]
  );

  // clear selection if the chosen id is no longer available
  useEffect(() => {
    if (exerciseToAdd && !availableExercises.some((a) => String(a.exerciseId) === exerciseToAdd)) {
      setExerciseToAdd("");
    }
  }, [exerciseToAdd, availableExercises]);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    const load = async () => {
      setLoadingLists(true);
      try {
        const [cRes, eRes] = await Promise.all([
          api.get<ClientItem[]>("/api/Users/Clients"),
          api.get<Exercise[]>("/api/Exercises"),
        ]);
        if (!mounted) return;
        setClients((cRes.data ?? []) as ClientItem[]);
        setExercises(eRes.data ?? []);
      } catch (err) {
        console.error("Failed to load clients or exercises", err);
      } finally {
        if (mounted) setLoadingLists(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
      setClientId("");
      setSelectedExercises([]);
      setExerciseToAdd("");
      setError(null);
    }
  }, [open]);

  const handleAddExercise = () => {
    if (!exerciseToAdd) return;
    const ex = exercises.find((x) => x.exerciseId === Number(exerciseToAdd));
    if (!ex) return;
    // duplicate check (extra safety)
    if (selectedExercises.some((s) => s.exerciseId === ex.exerciseId)) {
      setExerciseToAdd("");
      return;
    }
    setSelectedExercises((s) => [...s, ex]);
    setExerciseToAdd("");
  };

  const handleRemoveExercise = (id: number | null) => {
    if (id == null) return;
    setSelectedExercises((s) => s.filter((x) => x.exerciseId !== id));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    if (clientId === "") {
      setError("Please select a client.");
      return;
    }

    // include full exercise objects in the payload (not only ids)
    const exercisesPayload = (selectedExercises ?? []).map((e) => ({
      exerciseId: e.exerciseId,
      name: e.name ?? "",
      description: e.description ?? "",
      sets: e.sets ?? 0,
      repetitions: e.repetitions ?? 0,
      time: e.time ?? "",
      workoutProgramId: e.workoutProgramId ?? null,
      personalTrainerId: e.personalTrainerId ?? null,
    }));

    const payload = {
      name: name.trim(),
      description: description?.trim() ?? "",
      exercises: exercisesPayload,
      clientId: Number(clientId),
    };

    setLoading(true);
    try {
      const res = await api.post("/api/WorkoutPrograms", payload);
      if (!(res.status >= 200 && res.status < 300)) {
        throw new Error(`Unexpected status ${res.status}`);
      }
      const created = (res.data ?? { ...payload }) as WorkoutProgram;
      onCreated?.(created);
      onClose();
    } catch (err: any) {
      console.error("Create workout failed", err);
      const remote = err?.response?.data;
      setError(remote?.title ?? remote?.message ?? err?.message ?? "Failed to create workout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Create New Workout
        <IconButton aria-label="close" onClick={onClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {loadingLists ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />

            <FormControl fullWidth size="small">
              <InputLabel id="client-select-label">Select client</InputLabel>
              <Select
                labelId="client-select-label"
                value={clientId}
                label="Select client"
                onChange={(e) => setClientId(String(e.target.value))}
              >
                <MenuItem value="">
                  <em>— select —</em>
                </MenuItem>
                {clients.map((c) => {
                  // use userId from API (avoid undefined keys)
                  if (c.userId == null) return null;
                  const label = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim() || c.email || String(c.userId);
                  return (
                    <MenuItem key={String(c.userId)} value={String(c.userId)}>
                      {label} {c.email ? `(${c.email})` : ""}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <Box>
              <Typography sx={{ mb: 1, fontWeight: 600 }}>Exercises (optional)</Typography>

              <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
                <FormControl size="small" sx={{ minWidth: 240 }}>
                  <InputLabel id="exercise-add-label">Exercise</InputLabel>
                  <Select
                    labelId="exercise-add-label"
                    value={exerciseToAdd}
                    label="Exercise"
                    onChange={(e) => setExerciseToAdd(String(e.target.value))}
                  >
                    <MenuItem value="">
                      <em>— select —</em>
                    </MenuItem>

                    {availableExercises.length === 0 ? (
                      <MenuItem value="" disabled>
                        <em>No exercises available</em>
                      </MenuItem>
                    ) : (
                      availableExercises.map((ex) => (
                        <MenuItem key={String(ex.exerciseId)} value={String(ex.exerciseId)}>
                          {ex.name}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddExercise}
                  disabled={!exerciseToAdd}
                  aria-label="add-exercise"
                >
                  Add
                </Button>
              </Box>

              <List dense>
                {selectedExercises.map((ex) => (
                  <ListItem
                    key={String(ex.exerciseId)}
                    secondaryAction={
                      <IconButton edge="end" aria-label="remove" onClick={() => handleRemoveExercise(ex.exerciseId)}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={ex.name ?? "—"}
                      secondary={`Sets: ${ex.sets ?? "-"} • Reps: ${ex.repetitions ?? "-"} • Time: ${ex.time ?? "-"}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            {error && (
              <Typography color="error" sx={{ fontSize: 13 }}>
                {error}
              </Typography>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={18} /> : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}