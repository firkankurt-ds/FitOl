export interface UserProfile {
  firstName: string;
  lastName: string;
  gender: 'Male' | 'Female';
  weight: number; // in kg
  age: number;
  height?: number; // in cm
  image?: string;
}

export interface WorkoutSet {
  id: string;
  reps: number | string;
  weight: number | string; // in kg
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

export interface Workout {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  programId?: string;
  programName?: string;
  exercises: WorkoutExercise[];
  completed: boolean;
}

export interface ProgramExercise {
  name: string;
  defaultSets: number;
  defaultReps: number;
}

export interface Program {
  id: string;
  name: string;
  exercises: ProgramExercise[];
}
