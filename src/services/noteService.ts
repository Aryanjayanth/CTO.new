import { db } from '../database/db';
import { Note } from '../types';
import { v4 as uuidv4 } from './uuid';

export const noteService = {
  getAll(): Note[] {
    const notes = db.prepare('SELECT * FROM notes ORDER BY updated_at DESC').all() as any[];
    return notes.map(note => ({
      ...note,
      tags: note.tags ? JSON.parse(note.tags) : [],
    }));
  },

  getById(id: string): Note | undefined {
    const note = db.prepare('SELECT * FROM notes WHERE id = ?').get(id) as any;
    if (!note) return undefined;
    return {
      ...note,
      tags: note.tags ? JSON.parse(note.tags) : [],
    };
  },

  create(data: Omit<Note, 'id' | 'created_at' | 'updated_at'>): Note {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO notes (id, title, content, folder, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.title, data.content || '', data.folder, JSON.stringify(data.tags || []), now, now);
    
    return this.getById(id)!;
  },

  update(id: string, data: Partial<Note>): Note {
    const now = new Date().toISOString();
    const fields = [];
    const values = [];

    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.content !== undefined) {
      fields.push('content = ?');
      values.push(data.content);
    }
    if (data.folder !== undefined) {
      fields.push('folder = ?');
      values.push(data.folder);
    }
    if (data.tags !== undefined) {
      fields.push('tags = ?');
      values.push(JSON.stringify(data.tags));
    }

    fields.push('updated_at = ?');
    values.push(now);
    values.push(id);

    db.prepare(`UPDATE notes SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.getById(id)!;
  },

  delete(id: string): void {
    db.prepare('DELETE FROM notes WHERE id = ?').run(id);
  },

  getByFolder(folder: string): Note[] {
    const notes = db.prepare('SELECT * FROM notes WHERE folder = ? ORDER BY updated_at DESC').all(folder) as any[];
    return notes.map(note => ({
      ...note,
      tags: note.tags ? JSON.parse(note.tags) : [],
    }));
  },

  getAllFolders(): string[] {
    const folders = db.prepare('SELECT DISTINCT folder FROM notes').all() as any[];
    return folders.map(f => f.folder);
  },

  search(query: string): Note[] {
    const notes = db.prepare(`
      SELECT * FROM notes 
      WHERE title LIKE ? OR content LIKE ? OR tags LIKE ?
      ORDER BY updated_at DESC
    `).all(`%${query}%`, `%${query}%`, `%${query}%`) as any[];
    
    return notes.map(note => ({
      ...note,
      tags: note.tags ? JSON.parse(note.tags) : [],
    }));
  },
};
