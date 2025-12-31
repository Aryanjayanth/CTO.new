export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'incomplete' | 'complete';
export type HabitFrequency = 'daily' | 'weekly';
export type EventType = 'work' | 'personal' | 'health' | 'other';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  due_date?: string;
  created_at: string;
  updated_at: string;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  color: string;
  type: EventType;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: HabitFrequency;
  color: string;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
}

export interface Routine {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  days: string[];
  color: string;
  category: string;
  created_at: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  colorScheme: string;
}

export type ViewMode = 'tasks' | 'notes' | 'calendar' | 'habits' | 'timetable' | 'settings';
