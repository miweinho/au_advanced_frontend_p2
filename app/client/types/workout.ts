export interface Exercise {
  exerciseId: string;
  name: string;
  description?: string;
  sets: number;
  repetitions: number;
  restTime?: number;
  difficulty?: string;
  instructions?: string;
}

export interface WorkoutProgram {
  workoutProgramId: string;
  name: string;
  description?: string;
  exercises: Exercise[];
}