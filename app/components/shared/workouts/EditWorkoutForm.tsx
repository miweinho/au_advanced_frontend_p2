'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Stack,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { api } from '@/lib/api';
import { WorkoutProgram, Exercise } from '@/app/components/shared/types/workout';
import EditExerciseForm from './EditExerciseForm';
import { useAuth } from '@/app/ui/AuthProvider';

interface EditWorkoutFormProps {
  open: boolean;
  program?: WorkoutProgram | null; // when provided -> edit existing
  onClose: () => void;
  onSaved?: (updated: WorkoutProgram) => void; // called after workout updated (or after attaching exercises)
}

export default function EditWorkoutForm({ open, program, onClose, onSaved }: EditWorkoutFormProps) {
  const { getUserId } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // keep client and trainer as strings for select binding
  const [clientId, setClientId] = useState<string>('');
  const [personalTrainerId, setPersonalTrainerId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<{ userId: number; firstName?: string; lastName?: string; email?: string }[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]); // exercises currently on program
  const [openExerciseForm, setOpenExerciseForm] = useState(false);

  useEffect(() => {
    // populate fields when program or dialog opens
    setName(program?.name ?? '');
    setDescription(program?.description ?? '');
    setClientId(program?.clientId != null ? String(program.clientId) : '');
    setPersonalTrainerId(program?.personalTrainerId != null ? String(program.personalTrainerId) : '');
    setExercises(program?.exercises ?? []);
  }, [program, open]);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    const loadClients = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/Users/Clients');
        if (!mounted) return;
        setClients(res.data ?? []);
      } catch (err) {
        console.error('Failed to load clients', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadClients();
    return () => {
      mounted = false;
    };
  }, [open]);

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Name is required.');
      return;
    }
    if (!program?.workoutProgramId) {
      alert('Program id missing.');
      return;
    }

    const payload = {
      workoutProgramId: program.workoutProgramId,
      name: name.trim(),
      description: description?.trim() ?? '',
      personalTrainerId: personalTrainerId === '' ? null : Number(personalTrainerId),
      clientId: clientId === '' ? null : Number(clientId),
    };

    setSaving(true);
    try {
      const res = await api.put(`/api/WorkoutPrograms/${program.workoutProgramId}`, payload);
      const updated = res.data ?? ({ ...payload } as WorkoutProgram);
      onSaved?.(updated);
      onClose();
    } catch (err) {
      console.error('Failed to update program', err);
      alert('Failed to update workout program.');
    } finally {
      setSaving(false);
    }
  };

  // called after EditExerciseForm saved a new exercise (created)
  const handleExerciseCreated = async (created: Exercise) => {
    setOpenExerciseForm(false);

    if (!program?.workoutProgramId) {
      // nothing to attach to
      return;
    }

    // backend expects an array shape to attach exercises to a program
    const attachPayload = {
      exercises: [{ exerciseId: created.exerciseId }],
    };

    try {
      await api.post(`/api/Exercises/Program/${program.workoutProgramId}`, attachPayload);
      // refresh program from server to get updated exercises list
      try {
        const getRes = await api.get<WorkoutProgram>(`/api/WorkoutPrograms/${program.workoutProgramId}`);
        const refreshed = getRes.data ?? null;
        if (refreshed) {
          setExercises(refreshed.exercises ?? []);
          onSaved?.(refreshed);
        } else {
          // fallback: append created to local list
          setExercises((s) => [...s, created]);
        }
      } catch (err) {
        console.warn('Attach succeeded but failed to refresh program, appending locally', err);
        setExercises((s) => [...s, created]);
      }
    } catch (err) {
      console.error('Failed to attach new exercise to program', err);
      alert('Exercise created but failed to add it to the program.');
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          Edit Workout Program
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Program ID" value={program?.workoutProgramId ?? ''} fullWidth InputProps={{ readOnly: true }} />
            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth required />
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={2} />

            <FormControl size="small" fullWidth>
              <InputLabel id="client-edit-select">Client</InputLabel>
              <Select
                labelId="client-edit-select"
                value={clientId}
                label="Client"
                onChange={(e) => setClientId(String(e.target.value))}
              >
                <MenuItem value=""><em>— select —</em></MenuItem>
                {clients.map((c) => (
                  <MenuItem key={String(c.userId)} value={String(c.userId)}>
                    {`${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || c.email || String(c.userId)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Personal Trainer ID"
              value={personalTrainerId}
              onChange={(e) => setPersonalTrainerId(e.target.value.replace(/[^\d]/g, ''))}
              helperText="Trainer id (numeric)"
              size="small"
            />

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">Exercises in this program</Typography>
                <Button variant="outlined" onClick={() => setOpenExerciseForm(true)}>
                  Add new exercise
                </Button>
              </Stack>

              {exercises.length === 0 ? (
                <Typography color="text.secondary" sx={{ mt: 1 }}>No exercises in this program.</Typography>
              ) : (
                <List dense>
                  {exercises.map((ex) => (
                    <ListItem key={String(ex.exerciseId)}>
                      <ListItemText
                        primary={ex.name ?? '—'}
                        secondary={`Sets: ${ex.sets ?? '-'} • Reps: ${ex.repetitions ?? '-'} • Time: ${ex.time ?? '-'}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={18} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create single new exercise — opened repeatedly to add one exercise at a time */}
      <EditExerciseForm
        open={openExerciseForm}
        exercise={null}
        programId={program?.workoutProgramId ?? null}
        onClose={() => setOpenExerciseForm(false)}
        onSaved={(created) => {
          // EditExerciseForm already assigns personalTrainerId on create when possible.
          handleExerciseCreated(created);
        }}
      />
    </>
  );
}