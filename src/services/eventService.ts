import { db } from '../database/db';
import { Event, EventType } from '../types';
import { v4 as uuidv4 } from './uuid';

export const eventService = {
  getAll(): Event[] {
    return db.prepare('SELECT * FROM events ORDER BY start_time ASC').all() as Event[];
  },

  getById(id: string): Event | undefined {
    return db.prepare('SELECT * FROM events WHERE id = ?').get(id) as Event | undefined;
  },

  create(data: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Event {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO events (id, title, description, start_time, end_time, location, color, type, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.description || null,
      data.start_time,
      data.end_time || null,
      data.location || null,
      data.color,
      data.type,
      now,
      now
    );
    
    return this.getById(id)!;
  },

  update(id: string, data: Partial<Event>): Event {
    const now = new Date().toISOString();
    const fields = [];
    const values = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description);
    }
    if (data.start_time !== undefined) {
      fields.push('start_time = ?');
      values.push(data.start_time);
    }
    if (data.end_time !== undefined) {
      fields.push('end_time = ?');
      values.push(data.end_time);
    }
    if (data.location !== undefined) {
      fields.push('location = ?');
      values.push(data.location);
    }
    if (data.color !== undefined) {
      fields.push('color = ?');
      values.push(data.color);
    }
    if (data.type !== undefined) {
      fields.push('type = ?');
      values.push(data.type);
    }

    fields.push('updated_at = ?');
    values.push(now);
    values.push(id);

    db.prepare(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.getById(id)!;
  },

  delete(id: string): void {
    db.prepare('DELETE FROM events WHERE id = ?').run(id);
  },

  getByDateRange(startDate: string, endDate: string): Event[] {
    return db.prepare(`
      SELECT * FROM events 
      WHERE start_time >= ? AND start_time <= ?
      ORDER BY start_time ASC
    `).all(startDate, endDate) as Event[];
  },

  getByType(type: EventType): Event[] {
    return db.prepare('SELECT * FROM events WHERE type = ? ORDER BY start_time ASC').all(type) as Event[];
  },
};
