import { db } from '../database/db';
import { Habit, HabitLog } from '../types';
import { v4 as uuidv4 } from './uuid';

export const habitService = {
  getAll(): Habit[] {
    return db.prepare('SELECT * FROM habits ORDER BY created_at DESC').all() as Habit[];
  },

  getById(id: string): Habit | undefined {
    return db.prepare('SELECT * FROM habits WHERE id = ?').get(id) as Habit | undefined;
  },

  create(data: Omit<Habit, 'id' | 'created_at'>): Habit {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO habits (id, name, frequency, color, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, data.name, data.frequency, data.color, now);
    
    return this.getById(id)!;
  },

  update(id: string, data: Partial<Habit>): Habit {
    const fields = [];
    const values = [];

    if (data.name !== undefined) {
      fields.push('name = ?');
      values.push(data.name);
    }
    if (data.frequency !== undefined) {
      fields.push('frequency = ?');
      values.push(data.frequency);
    }
    if (data.color !== undefined) {
      fields.push('color = ?');
      values.push(data.color);
    }

    values.push(id);
    db.prepare(`UPDATE habits SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.getById(id)!;
  },

  delete(id: string): void {
    db.prepare('DELETE FROM habits WHERE id = ?').run(id);
  },

  logHabit(habitId: string, date: string, completed: boolean): void {
    db.prepare(`
      INSERT OR REPLACE INTO habit_logs (id, habit_id, date, completed)
      VALUES (?, ?, ?, ?)
    `).run(uuidv4(), habitId, date, completed ? 1 : 0);
  },

  getLog(habitId: string, date: string): HabitLog | undefined {
    const log = db.prepare(`
      SELECT * FROM habit_logs WHERE habit_id = ? AND date = ?
    `).get(habitId, date) as any;
    
    if (!log) return undefined;
    return {
      ...log,
      completed: Boolean(log.completed),
    };
  },

  getLogs(habitId: string, startDate: string, endDate: string): HabitLog[] {
    const logs = db.prepare(`
      SELECT * FROM habit_logs 
      WHERE habit_id = ? AND date >= ? AND date <= ?
      ORDER BY date DESC
    `).all(habitId, startDate, endDate) as any[];
    
    return logs.map(log => ({
      ...log,
      completed: Boolean(log.completed),
    }));
  },

  getStreak(habitId: string): number {
    const today = new Date();
    let streak = 0;
    const currentDate = new Date(today);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const log = this.getLog(habitId, dateStr);
      
      if (!log || !log.completed) {
        break;
      }
      
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  },

  getSuccessRate(habitId: string, days: number = 30): number {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = this.getLogs(
      habitId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );

    if (logs.length === 0) return 0;

    const completedCount = logs.filter(log => log.completed).length;
    return Math.round((completedCount / days) * 100);
  },
};
