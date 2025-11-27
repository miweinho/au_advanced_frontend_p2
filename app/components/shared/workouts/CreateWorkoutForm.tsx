'use client';

import { useEffect, useState } from "react";
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
import { WorkoutProgram, Exercise } from "@/app/client/types/workout";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

type ClientItem = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
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
  const [clientId, setClientId] = useState<number | null>(null);

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [exerciseToAdd, setExerciseToAdd] = useState<number | "">( "");
  const [loading, setLoading] = useState(false);
  const [loadingLists, setLoadingLists] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setClientId(null);
      setSelectedExercises([]);
      setExerciseToAdd("");
      setError(null);
    }
  }, [open]);

  const handleAddExercise = () => {
    if (!exerciseToAdd) return;
    const ex = exercises.find((x) => x.exerciseId === Number(exerciseToAdd));
    if (!ex) return;
    if (selectedExercises.some((s) => s.exerciseId === ex.exerciseId)) {
      setExerciseToAdd("");
      return;
    }
    setSelectedExercises((s) => [...s, ex]);
    setExerciseToAdd("");
  };

  const handleRemoveExercise = (id: number) => {
    setSelectedExercises((s) => s.filter((x) => x.exerciseId !== id));
  };

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Name ist erforderlich.");
      return;
    }
    if (clientId == null) {
      setError("Bitte einen Client auswählen.");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description?.trim() ?? "",
      // send exercises as array (we keep only ids to be safe)
      exercises: (selectedExercises ?? []).map((e) => ({ exerciseId: e.exerciseId })),
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
      setError(remote?.title ?? remote?.message ?? err?.message ?? "Fehler beim Erstellen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Neues Workout erstellen
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
              label="Beschreibung"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />

            <FormControl fullWidth size="small">
              <InputLabel id="client-select-label">Client auswählen</InputLabel>
              <Select
                labelId="client-select-label"
                value={clientId ?? ""}
                label="Client auswählen"
                onChange={(e) => setClientId(e.target.value === "" ? null : Number(e.target.value))}
              >
                <MenuItem value="">
                  <em>— auswählen —</em>
                </MenuItem>
                {clients.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.firstName || ""} {c.lastName || ""} {c.email ? `(${c.email})` : ""}
                  </MenuItem>
                ))}
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
                    onChange={(e) => setExerciseToAdd(e.target.value as number | "")}
                  >
                    <MenuItem value="">
                      <em>— auswählen —</em>
                    </MenuItem>
                    {exercises.map((ex) => (
                      <MenuItem key={ex.exerciseId} value={ex.exerciseId}>
                        {ex.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Button variant="outlined" startIcon={<AddIcon />} onClick={handleAddExercise} disabled={!exerciseToAdd}>
                  Hinzufügen
                </Button>
              </Box>

              <List dense>
                {selectedExercises.map((ex) => (
                  <ListItem
                    key={ex.exerciseId}
                    secondaryAction={
                      <IconButton edge="end" aria-label="remove" onClick={() => handleRemoveExercise(ex.exerciseId)}>
                        <RemoveCircleOutlineIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText primary={ex.name ?? "—"} secondary={`Sets: ${ex.sets ?? "-"} • Reps: ${ex.repetitions ?? "-"} • Time: ${ex.time ?? "-"}`} />
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
          Abbrechen
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? <CircularProgress size={18} /> : "Erstellen"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}