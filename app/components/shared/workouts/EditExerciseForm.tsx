'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { Exercise } from '@/app/components/shared/types/workout';
import { api } from '@/lib/api';
import { useAuth } from '@/app/ui/AuthProvider';

interface EditExerciseFormProps {
  open: boolean;
  exercise?: Exercise | null; // when provided -> edit, otherwise -> create
  programId?: string | number | null; // optional program to attach new exercise (not editable)
  onClose: () => void;
  onSaved?: (updated: Exercise) => void;
}

export default function EditExerciseForm({
  open,
  exercise,
  programId,
  onClose,
  onSaved,
}: EditExerciseFormProps) {
  const { getUserId } = useAuth();

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [sets, setSets] = useState<string>('');
  const [repetitions, setReps] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // populate form when editing or when dialog opens
  useEffect(() => {
    setName(exercise?.name ?? '');
    setDescription(exercise?.description ?? '');
    setSets(exercise?.sets != null ? String(exercise?.sets) : '');
    setReps(exercise?.repetitions != null ? String(exercise?.repetitions) : '');
    setTime(exercise?.time != null ? String(exercise?.time) : '');
  }, [exercise, open]);

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Name is required.');
      return;
    }

    const payloadCreate = {
      name: name.trim(),
      description: description?.trim() ?? '',
      sets: sets !== '' ? Number(sets) : 0,
      repetitions: repetitions !== '' ? Number(repetitions) : 0,
      time: time?.trim() ?? '',
    };

    setLoading(true);
    try {
      if (exercise?.exerciseId) {
        // update (keep ids and non-editable fields from original exercise)
        const payloadUpdate = {
          exerciseId: exercise.exerciseId,
          name: name.trim(),
          description: description?.trim() ?? '',
          sets: sets !== '' ? Number(sets) : 0,
          repetitions: repetitions !== '' ? Number(repetitions) : 0,
          time: time?.trim() ?? '',
          workoutProgramId: exercise.workoutProgramId ?? null,
          personalTrainerId: exercise.personalTrainerId ?? null,
        };

        const res = await api.put(`/api/Exercises/${exercise.exerciseId}`, payloadUpdate);
        const saved: Exercise = res.data ?? (payloadUpdate as unknown as Exercise);
        onSaved?.(saved);
      } else {
        // create: POST, then assign personalTrainerId via PUT (if available)
        const res = await api.post<Exercise>('/api/Exercises', payloadCreate);
        const created: Exercise =
          res.data ??
          ({
            ...payloadCreate,
          } as Exercise);

        // attempt to attach current trainer id
        const trainerId = getUserId ? getUserId() : null;
        console.log(trainerId);
        if (created.exerciseId && trainerId != null) {
          try {
            // send only the exact fields required by the API
            const assignPayload = {
              exerciseId: created.exerciseId,
              name: created.name ?? '',
              description: created.description ?? '',
              sets: created.sets ?? 0,
              repetitions: created.repetitions ?? 0,
              time: created.time ?? '',
              workoutProgramId: created.workoutProgramId ?? null,
              personalTrainerId: trainerId,
            };
            // keep workoutProgramId as-is (may be null)
            const assignRes = await api.put(`/api/Exercises/${created.exerciseId}`, assignPayload);
            const final: Exercise = assignRes.data ?? (assignPayload as Exercise);
            onSaved?.(final);
          } catch (assignErr) {
            console.error('Failed to assign personalTrainerId', assignErr);
            // fallback: return created object
            onSaved?.(created);
          }
        } else {
          // no trainer id available or no exerciseId returned
          onSaved?.(created);
        }
      }
      onClose();
    } catch (err) {
      console.error('Failed to save exercise', err);
      alert('Failed to save exercise.');
    } finally {
      setLoading(false);
    }
  };

  const isEdit = Boolean(exercise?.exerciseId);
  const title = isEdit ? 'Edit Exercise' : 'Create Exercise';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Exercise name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={3}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Sets"
              value={sets}
              onChange={(e) => setSets(e.target.value.replace(/[^\d-]/g, ''))}
              type="number"
              sx={{ width: 120 }}
            />
            <TextField
              label="Repetitions"
              value={repetitions}
              onChange={(e) => setReps(e.target.value.replace(/[^\d-]/g, ''))}
              type="number"
              sx={{ width: 160 }}
            />
            <TextField
              label="Time (e.g. 30 sec)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              sx={{ flex: 1 }}
            />
          </Box>

          {/* show non-editable ids when editing for reference */}
          {isEdit && (
            <Box sx={{ fontSize: 13, color: 'text.secondary' }}>
              <div>Exercise ID: {exercise?.exerciseId}</div>
              <div>Program ID: {exercise?.workoutProgramId ?? '-'}</div>
              <div>Trainer ID: {exercise?.personalTrainerId ?? '-'}</div>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>
          {loading ? <CircularProgress size={18} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}