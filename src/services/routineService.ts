import { db } from '../database/db';
import { Routine } from '../types';
import { v4 as uuidv4 } from './uuid';

export const routineService = {
  getAll(): Routine[] {
    const routines = db.prepare('SELECT * FROM routines ORDER BY start_time ASC').all() as any[];
    return routines.map(routine => ({
      ...routine,
      days: JSON.parse(routine.days),
    }));
  },

  getById(id: string): Routine | undefined {
    const routine = db.prepare('SELECT * FROM routines WHERE id = ?').get(id) as any;
    if (!routine) return undefined;
    return {
      ...routine,
      days: JSON.parse(routine.days),
    };
  },

  create(data: Omit<Routine, 'id' | 'created_at'>): Routine {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO routines (id, title, start_time, end_time, days, color, category, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.start_time,
      data.end_time,
      JSON.stringify(data.days),
      data.color,
      data.category,
      now
    );
    
    return this.getById(id)!;
  },

  update(id: string, data: Partial<Routine>): Routine {
    const fields = [];
    const values = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.start_time !== undefined) {
      fields.push('start_time = ?');
      values.push(data.start_time);
    }
    if (data.end_time !== undefined) {
      fields.push('end_time = ?');
      values.push(data.end_time);
    }
    if (data.days !== undefined) {
      fields.push('days = ?');
      values.push(JSON.stringify(data.days));
    }
    if (data.color !== undefined) {
      fields.push('color = ?');
      values.push(data.color);
    }
    if (data.category !== undefined) {
      fields.push('category = ?');
      values.push(data.category);
    }

    values.push(id);
    db.prepare(`UPDATE routines SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.getById(id)!;
  },

  delete(id: string): void {
    db.prepare('DELETE FROM routines WHERE id = ?').run(id);
  },

  getForDay(dayOfWeek: string): Routine[] {
    const routines = this.getAll();
    return routines.filter(routine => routine.days.includes(dayOfWeek));
  },
};
