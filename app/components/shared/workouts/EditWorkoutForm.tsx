'use client';

import { useState } from 'react';
import { Box, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { WorkoutProgram } from '../../../types/workout';
import { api } from '@/lib/api';

interface EditWorkoutFormProps {
  open: boolean;
  program: WorkoutProgram;
  onClose: () => void;
  onSaved?: (updated: WorkoutProgram) => void;
}

export default function EditWorkoutForm({ open, program, onClose, onSaved }: EditWorkoutFormProps) {
  const [name, setName] = useState(program.name || '');
  const [description, setDescription] = useState(program.description || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      // example API call - adjust endpoint/method per backend
      const res = await api.put(`/api/WorkoutPrograms/${program.workoutProgramId}`, {
        ...program,
        name,
        description
      });
      onSaved?.(res.data || { ...program, name, description });
      onClose();
    } catch (e) {
      console.error(e);
      // show toast / handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Workout</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={loading}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}