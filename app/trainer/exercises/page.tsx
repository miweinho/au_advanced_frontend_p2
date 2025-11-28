"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/app/ui/AuthProvider";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import EditExerciseForm from "@/app/components/shared/workouts/EditExerciseForm";
import ExerciseDialog from "@/app/components/shared/ExerciseDialog";
import { Plus, Edit, Trash } from "lucide-react";
import { Exercise as ExerciseItem } from "@/app/components/shared/types/workout";

export default function TrainerExercisesPage() {
  const { user, isTrainer } = useAuth();

  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editing, setEditing] = useState<ExerciseItem | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // selected exercise shown in ExerciseDialog
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);

  // filter: "assigned" or "unassigned"
  const [filter, setFilter] = useState<"assigned" | "unassigned">("assigned");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        if (filter === "unassigned") {
          const res = await api.get<ExerciseItem[]>("/api/Exercises/unassigned");
          if (!mounted) return;
          setExercises(res.data ?? []);
        } else {
          // assigned or default: load all trainer exercises then keep only assigned ones
          const res = await api.get<ExerciseItem[]>("/api/Exercises");
          if (!mounted) return;
          const all = res.data ?? [];
          // assigned = workoutProgramId != null
          const assigned = all.filter((e) => e.workoutProgramId != null);
          setExercises(assigned);
        }
      } catch (err) {
        console.error("Failed to load exercises", err);
        if (mounted) setExercises([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [filter]);

  const canEditExercise = () => Boolean(isTrainer);

  const handleEdit = (ex: ExerciseItem) => {
    if (!canEditExercise()) {
      alert("Only personal trainers may edit exercises.");
      return;
    }
    setEditing(ex);
    setEditOpen(true);
  };

  const handleAdd = () => {
    if (!isTrainer) {
      alert("Only personal trainers may add exercises.");
      return;
    }
    setSelectedExercise(null);
    setEditing(null);
    setEditOpen(true);
  };

  const handleDelete = async (ex: ExerciseItem) => {
    if (!canEditExercise()) {
      alert("Only personal trainers may delete exercises.");
      return;
    }
    if (!confirm(`Delete exercise "${ex.name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/api/Exercises/${ex.exerciseId}`);
      setExercises((prev) => prev.filter((e) => e.exerciseId !== ex.exerciseId));
      if (selectedExercise?.exerciseId === ex.exerciseId) setSelectedExercise(null);
      if (editing?.exerciseId === ex.exerciseId) {
        setEditing(null);
        setEditOpen(false);
      }
    } catch (err) {
      console.error("Failed to delete exercise", err);
      alert("Failed to delete exercise.");
    }
  };

  const handleSaved = (updated: ExerciseItem) => {
    setExercises((prev) => {
      const exists = prev.some((e) => e.exerciseId === updated.exerciseId);
      if (exists) return prev.map((e) => (e.exerciseId === updated.exerciseId ? updated : e));
      // if created and fits the current filter, prepend
      if (filter === "unassigned" && (updated.workoutProgramId == null)) return [updated, ...prev];
      if (filter === "assigned" && (updated.workoutProgramId != null)) return [updated, ...prev];
      return prev;
    });
    setEditOpen(false);
    setEditing(null);
    setSelectedExercise((cur) => (cur && cur.exerciseId === updated.exerciseId ? updated : cur));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, gap: 2 }}>
        <Box>
          <Typography variant="h4">Exercises</Typography>
          <Typography color="text.secondary">Edit and manage your exercise library</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="exercise-filter-label">Filter</InputLabel>
            <Select
              labelId="exercise-filter-label"
              value={filter}
              label="Filter"
              onChange={(e) => {
                setFilter(e.target.value as "assigned" | "unassigned");
                setSelectedExercise(null); // clear selection when switching
              }}
            >
              <MenuItem value="assigned">Assigned</MenuItem>
              <MenuItem value="unassigned">Unassigned</MenuItem>
            </Select>
          </FormControl>

          {isTrainer && (
            <Button startIcon={<Plus />} variant="contained" onClick={handleAdd}>
              Add Exercise
            </Button>
          )}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress />
        </Box>
      ) : exercises.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography>No exercises found for "{filter}".</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 3 }}>
          {exercises.map((ex) => (
            <Paper
              key={ex.exerciseId}
              sx={{ p: 2, cursor: "pointer" }}
              onClick={(e) => {
                const target = e.target as HTMLElement | null;
                if (target?.closest("button, a, input, svg")) return;
                setSelectedExercise(ex);
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>{ex.name}</Typography>
                  {ex.description && (
                    <Typography sx={{ color: "text.secondary", fontSize: 13 }}>{ex.description}</Typography>
                  )}
                  <Typography sx={{ color: "text.secondary", fontSize: 12, mt: 1 }}>
                    Sets: {ex.sets ?? "-"} • Reps: {ex.repetitions ?? "-"} • Time: {ex.time ?? "-"}
                  </Typography>
                </Box>

                {/* right column: stacked action buttons */}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end", ml: 1 }}>
                  {canEditExercise() && (
                    <>
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(ex);
                        }}
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        aria-label="delete"
                        size="small"
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(ex);
                        }}
                      >
                        <Trash />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {editOpen && isTrainer && (
        <EditExerciseForm
          open={editOpen}
          exercise={editing ?? null}
          onClose={() => {
            setEditOpen(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}

      <ExerciseDialog exercise={selectedExercise as any} open={!!selectedExercise} onClose={() => setSelectedExercise(null)} />
    </Container>
  );
}