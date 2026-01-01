import { db } from '../database/db';
import { Settings } from '../types';

export const settingsService = {
  get(): Settings {
    const settings = db.prepare('SELECT * FROM settings').all() as { key: string; value: string }[];
    const settingsObj: any = {};
    settings.forEach(({ key, value }) => {
      settingsObj[key] = value;
    });
    return settingsObj as Settings;
  },

  set(key: keyof Settings, value: string): void {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value);
  },

  exportData(): string {
    const tasks = db.prepare('SELECT * FROM tasks').all();
    const subtasks = db.prepare('SELECT * FROM subtasks').all();
    const notes = db.prepare('SELECT * FROM notes').all();
    const events = db.prepare('SELECT * FROM events').all();
    const habits = db.prepare('SELECT * FROM habits').all();
    const habitLogs = db.prepare('SELECT * FROM habit_logs').all();
    const routines = db.prepare('SELECT * FROM routines').all();
    const settings = db.prepare('SELECT * FROM settings').all();

    return JSON.stringify({
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      data: {
        tasks,
        subtasks,
        notes,
        events,
        habits,
        habitLogs,
        routines,
        settings,
      },
    }, null, 2);
  },

  importData(jsonData: string): void {
    const data = JSON.parse(jsonData);
    
    db.transaction(() => {
      db.prepare('DELETE FROM tasks').run();
      db.prepare('DELETE FROM subtasks').run();
      db.prepare('DELETE FROM notes').run();
      db.prepare('DELETE FROM events').run();
      db.prepare('DELETE FROM habits').run();
      db.prepare('DELETE FROM habit_logs').run();
      db.prepare('DELETE FROM routines').run();

      if (data.data.tasks) {
        const insertTask = db.prepare(`
          INSERT INTO tasks (id, title, description, priority, status, due_date, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        data.data.tasks.forEach((task: any) => {
          insertTask.run(
            task.id,
            task.title,
            task.description,
            task.priority,
            task.status,
            task.due_date,
            task.created_at,
            task.updated_at
          );
        });
      }

      if (data.data.subtasks) {
        const insertSubtask = db.prepare(`
          INSERT INTO subtasks (id, task_id, title, completed, created_at)
          VALUES (?, ?, ?, ?, ?)
        `);
        data.data.subtasks.forEach((subtask: any) => {
          insertSubtask.run(
            subtask.id,
            subtask.task_id,
            subtask.title,
            subtask.completed,
            subtask.created_at
          );
        });
      }

      if (data.data.notes) {
        const insertNote = db.prepare(`
          INSERT INTO notes (id, title, content, folder, tags, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        data.data.notes.forEach((note: any) => {
          insertNote.run(
            note.id,
            note.title,
            note.content,
            note.folder,
            note.tags,
            note.created_at,
            note.updated_at
          );
        });
      }

      if (data.data.events) {
        const insertEvent = db.prepare(`
          INSERT INTO events (id, title, description, start_time, end_time, location, color, type, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        data.data.events.forEach((event: any) => {
          insertEvent.run(
            event.id,
            event.title,
            event.description,
            event.start_time,
            event.end_time,
            event.location,
            event.color,
            event.type,
            event.created_at,
            event.updated_at
          );
        });
      }

      if (data.data.habits) {
        const insertHabit = db.prepare(`
          INSERT INTO habits (id, name, frequency, color, created_at)
          VALUES (?, ?, ?, ?, ?)
        `);
        data.data.habits.forEach((habit: any) => {
          insertHabit.run(habit.id, habit.name, habit.frequency, habit.color, habit.created_at);
        });
      }

      if (data.data.habitLogs) {
        const insertLog = db.prepare(`
          INSERT INTO habit_logs (id, habit_id, date, completed)
          VALUES (?, ?, ?, ?)
        `);
        data.data.habitLogs.forEach((log: any) => {
          insertLog.run(log.id, log.habit_id, log.date, log.completed);
        });
      }

      if (data.data.routines) {
        const insertRoutine = db.prepare(`
          INSERT INTO routines (id, title, start_time, end_time, days, color, category, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        data.data.routines.forEach((routine: any) => {
          insertRoutine.run(
            routine.id,
            routine.title,
            routine.start_time,
            routine.end_time,
            routine.days,
            routine.color,
            routine.category,
            routine.created_at
          );
        });
      }

      if (data.data.settings) {
        const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
        data.data.settings.forEach((setting: any) => {
          insertSetting.run(setting.key, setting.value);
        });
      }
    })();
  },
};
