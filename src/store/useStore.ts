import { create } from 'zustand';
import { Task, Note, Event, Habit, Routine, Settings, ViewMode } from '../types';
import { taskService } from '../services/taskService';
import { noteService } from '../services/noteService';
import { eventService } from '../services/eventService';
import { habitService } from '../services/habitService';
import { routineService } from '../services/routineService';
import { settingsService } from '../services/settingsService';

interface AppState {
  currentView: ViewMode;
  tasks: Task[];
  notes: Note[];
  events: Event[];
  habits: Habit[];
  routines: Routine[];
  settings: Settings;
  
  setCurrentView: (view: ViewMode) => void;
  
  loadTasks: () => void;
  createTask: (data: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void;
  updateTask: (id: string, data: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  loadNotes: () => void;
  createNote: (data: Omit<Note, 'id' | 'created_at' | 'updated_at'>) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  loadEvents: () => void;
  createEvent: (data: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => void;
  updateEvent: (id: string, data: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  loadHabits: () => void;
  createHabit: (data: Omit<Habit, 'id' | 'created_at'>) => void;
  updateHabit: (id: string, data: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  logHabit: (habitId: string, date: string, completed: boolean) => void;
  
  loadRoutines: () => void;
  createRoutine: (data: Omit<Routine, 'id' | 'created_at'>) => void;
  updateRoutine: (id: string, data: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  
  loadSettings: () => void;
  updateSettings: (key: keyof Settings, value: string) => void;
  
  exportData: () => string;
  importData: (data: string) => void;
}

export const useStore = create<AppState>((set) => ({
  currentView: 'tasks',
  tasks: [],
  notes: [],
  events: [],
  habits: [],
  routines: [],
  settings: { theme: 'light', colorScheme: 'blue' },
  
  setCurrentView: (view) => set({ currentView: view }),
  
  loadTasks: () => set({ tasks: taskService.getAll() }),
  createTask: (data) => {
    taskService.create(data);
    set({ tasks: taskService.getAll() });
  },
  updateTask: (id, data) => {
    taskService.update(id, data);
    set({ tasks: taskService.getAll() });
  },
  deleteTask: (id) => {
    taskService.delete(id);
    set({ tasks: taskService.getAll() });
  },
  
  loadNotes: () => set({ notes: noteService.getAll() }),
  createNote: (data) => {
    noteService.create(data);
    set({ notes: noteService.getAll() });
  },
  updateNote: (id, data) => {
    noteService.update(id, data);
    set({ notes: noteService.getAll() });
  },
  deleteNote: (id) => {
    noteService.delete(id);
    set({ notes: noteService.getAll() });
  },
  
  loadEvents: () => set({ events: eventService.getAll() }),
  createEvent: (data) => {
    eventService.create(data);
    set({ events: eventService.getAll() });
  },
  updateEvent: (id, data) => {
    eventService.update(id, data);
    set({ events: eventService.getAll() });
  },
  deleteEvent: (id) => {
    eventService.delete(id);
    set({ events: eventService.getAll() });
  },
  
  loadHabits: () => set({ habits: habitService.getAll() }),
  createHabit: (data) => {
    habitService.create(data);
    set({ habits: habitService.getAll() });
  },
  updateHabit: (id, data) => {
    habitService.update(id, data);
    set({ habits: habitService.getAll() });
  },
  deleteHabit: (id) => {
    habitService.delete(id);
    set({ habits: habitService.getAll() });
  },
  logHabit: (habitId, date, completed) => {
    habitService.logHabit(habitId, date, completed);
  },
  
  loadRoutines: () => set({ routines: routineService.getAll() }),
  createRoutine: (data) => {
    routineService.create(data);
    set({ routines: routineService.getAll() });
  },
  updateRoutine: (id, data) => {
    routineService.update(id, data);
    set({ routines: routineService.getAll() });
  },
  deleteRoutine: (id) => {
    routineService.delete(id);
    set({ routines: routineService.getAll() });
  },
  
  loadSettings: () => set({ settings: settingsService.get() }),
  updateSettings: (key, value) => {
    settingsService.set(key, value);
    set({ settings: settingsService.get() });
  },
  
  exportData: () => settingsService.exportData(),
  importData: (data) => {
    settingsService.importData(data);
    set({
      tasks: taskService.getAll(),
      notes: noteService.getAll(),
      events: eventService.getAll(),
      habits: habitService.getAll(),
      routines: routineService.getAll(),
      settings: settingsService.get(),
    });
  },
}));
