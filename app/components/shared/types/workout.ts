export interface Exercise {
  exerciseId: number | null;
  name: string | null;
  description?: string | null;
  sets?: number | null;
  repetitions?: number | null;
  restTime?: number | null;
  difficulty?: string | null;
  instructions?: string | null;
  time?: string | null;
  workoutProgramId?: number | null;
  personalTrainerId?: number | null;
}

export interface WorkoutProgram {
  workoutProgramId: number | null;
  name: string | null;
  description?: string | null;
  exercises?: Exercise[] | null;
  personalTrainerId?: number | null;
  clientId?: number | null;
}