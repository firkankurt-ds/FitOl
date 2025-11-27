import { UserProfile, Workout, Program } from '../types';

const KEYS = {
    USER: 'fitol_user',
    WORKOUTS: 'fitol_workouts',
    PROGRAMS: 'fitol_programs',
};

// --- User Profile ---
export const getUserProfile = (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : null;
};

export const saveUserProfile = (profile: UserProfile) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(KEYS.USER, JSON.stringify(profile));
};

// --- Workouts ---
export const getWorkouts = (): Workout[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.WORKOUTS);
    return data ? JSON.parse(data) : [];
};

export const saveWorkout = (workout: Workout) => {
    if (typeof window === 'undefined') return;
    const workouts = getWorkouts();
    const index = workouts.findIndex((w) => w.id === workout.id);

    if (index >= 0) {
        workouts[index] = workout;
    } else {
        workouts.push(workout);
    }

    localStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts));
};

export const getWorkoutByDate = (date: string): Workout | undefined => {
    const workouts = getWorkouts();
    return workouts.find((w) => w.date === date);
};

export const deleteWorkout = (date: string) => {
    if (typeof window === 'undefined') return;
    const workouts = getWorkouts();
    const filtered = workouts.filter((w) => w.date !== date);
    localStorage.setItem(KEYS.WORKOUTS, JSON.stringify(filtered));
};

// --- Programs ---
export const getPrograms = (): Program[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(KEYS.PROGRAMS);
    return data ? JSON.parse(data) : [];
};

export const saveProgram = (program: Program) => {
    if (typeof window === 'undefined') return;
    const programs = getPrograms();
    const index = programs.findIndex((p) => p.id === program.id);

    if (index >= 0) {
        programs[index] = program;
    } else {
        programs.push(program);
    }

    localStorage.setItem(KEYS.PROGRAMS, JSON.stringify(programs));
};

export const getUniqueExercises = (): string[] => {
    if (typeof window === 'undefined') return [];

    const workouts = getWorkouts();
    const programs = getPrograms();
    const exercises = new Set<string>();

    workouts.forEach(w => w.exercises.forEach(e => exercises.add(e.name)));
    programs.forEach(p => p.exercises.forEach(e => exercises.add(e.name)));

    return Array.from(exercises).sort();
};

// --- Initialization ---
export const initializeDefaults = () => {
    if (typeof window === 'undefined') return;

    // Check for version to force update programs
    const CURRENT_VERSION = 'v3_text_updates';
    const storedVersion = localStorage.getItem('fitol_version');

    if (storedVersion !== CURRENT_VERSION) {
        const defaultPrograms: Program[] = [
            {
                id: 'mon',
                name: 'Pazartesi (Chest & Shoulders)',
                exercises: [
                    { name: 'Bench Press', defaultSets: 4, defaultReps: 8 },
                    { name: 'Incline Dumbbell Press', defaultSets: 4, defaultReps: 8 },
                    { name: 'Cable Cross', defaultSets: 3, defaultReps: 12 },
                    { name: 'Overhead Press', defaultSets: 4, defaultReps: 10 },
                    { name: 'Lateral Raise', defaultSets: 4, defaultReps: 12 },
                    { name: 'Rear Delt', defaultSets: 3, defaultReps: 12 },
                    { name: 'Triceps Pushdown', defaultSets: 4, defaultReps: 10 },
                ],
            },
            {
                id: 'tue',
                name: 'Salı (Back & Arms)',
                exercises: [
                    { name: 'Lat Pulldown', defaultSets: 4, defaultReps: 10 },
                    { name: 'Barbell Row', defaultSets: 4, defaultReps: 10 },
                    { name: 'Cable Row', defaultSets: 3, defaultReps: 12 },
                    { name: 'Pullover', defaultSets: 3, defaultReps: 12 },
                    { name: 'Pull Up', defaultSets: 1, defaultReps: 10 },
                    { name: 'Barbell Curl', defaultSets: 4, defaultReps: 10 },
                    { name: 'Dumbell Curl', defaultSets: 4, defaultReps: 10 },
                ],
            },
            {
                id: 'wed',
                name: 'Çarşamba (Legs)',
                exercises: [
                    { name: 'Squat', defaultSets: 4, defaultReps: 10 },
                    { name: 'Leg Press', defaultSets: 4, defaultReps: 10 },
                    { name: 'Leg Curl', defaultSets: 5, defaultReps: 12 },
                    { name: 'Calf Raise', defaultSets: 4, defaultReps: 15 },
                ],
            },
            {
                id: 'fri',
                name: 'Cuma (Upper Body)',
                exercises: [
                    { name: 'Incline Dumbbell Press', defaultSets: 4, defaultReps: 8 },
                    { name: 'Cable Cross', defaultSets: 3, defaultReps: 12 },
                    { name: 'Overhead Press', defaultSets: 4, defaultReps: 10 },
                    { name: 'Lateral Raise', defaultSets: 3, defaultReps: 10 },
                    { name: 'Rear Delt', defaultSets: 3, defaultReps: 12 },
                    { name: 'Triceps Pushdown', defaultSets: 4, defaultReps: 10 },
                ],
            },
            {
                id: 'sat',
                name: 'Cumartesi (Full Body / Mix)',
                exercises: [
                    { name: 'Lat Pulldown', defaultSets: 4, defaultReps: 10 },
                    { name: 'Cable Row', defaultSets: 4, defaultReps: 12 },
                    { name: 'Romanian Deadlift', defaultSets: 4, defaultReps: 10 },
                    { name: 'Dumbell Curl', defaultSets: 4, defaultReps: 10 },
                    { name: 'Leg Press', defaultSets: 5, defaultReps: 10 },
                    { name: 'Calf Raise', defaultSets: 4, defaultReps: 15 },
                ],
            },
        ];
        localStorage.setItem(KEYS.PROGRAMS, JSON.stringify(defaultPrograms));
        localStorage.setItem('fitol_version', CURRENT_VERSION);
    }
};
