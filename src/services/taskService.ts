import { db } from '../database/db';
import { Task, Subtask, Priority, TaskStatus } from '../types';
import { v4 as uuidv4 } from './uuid';

export const taskService = {
  getAll(): Task[] {
    const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all() as any[];
    return tasks.map(task => ({
      ...task,
      subtasks: this.getSubtasks(task.id),
    }));
  },

  getById(id: string): Task | undefined {
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as any;
    if (!task) return undefined;
    return {
      ...task,
      subtasks: this.getSubtasks(task.id),
    };
  },

  create(data: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Task {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO tasks (id, title, description, priority, status, due_date, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.title, data.description || null, data.priority, data.status, data.due_date || null, now, now);
    
    return this.getById(id)!;
  },

  update(id: string, data: Partial<Task>): Task {
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
    if (data.priority !== undefined) {
      fields.push('priority = ?');
      values.push(data.priority);
    }
    if (data.status !== undefined) {
      fields.push('status = ?');
      values.push(data.status);
    }
    if (data.due_date !== undefined) {
      fields.push('due_date = ?');
      values.push(data.due_date);
    }

    fields.push('updated_at = ?');
    values.push(now);
    values.push(id);

    db.prepare(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    return this.getById(id)!;
  },

  delete(id: string): void {
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  },

  getSubtasks(taskId: string): Subtask[] {
    const subtasks = db.prepare('SELECT * FROM subtasks WHERE task_id = ?').all(taskId) as any[];
    return subtasks.map(st => ({
      ...st,
      completed: Boolean(st.completed),
    }));
  },

  addSubtask(taskId: string, title: string): Subtask {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO subtasks (id, task_id, title, completed, created_at)
      VALUES (?, ?, ?, 0, ?)
    `).run(id, taskId, title, now);
    
    return {
      id,
      task_id: taskId,
      title,
      completed: false,
      created_at: now,
    };
  },

  updateSubtask(id: string, completed: boolean): void {
    db.prepare('UPDATE subtasks SET completed = ? WHERE id = ?').run(completed ? 1 : 0, id);
  },

  deleteSubtask(id: string): void {
    db.prepare('DELETE FROM subtasks WHERE id = ?').run(id);
  },

  filterByDate(filter: 'today' | 'week' | 'month'): Task[] {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (filter) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        endDate = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        break;
    }

    const tasks = db.prepare(`
      SELECT * FROM tasks 
      WHERE due_date >= ? AND due_date <= ?
      ORDER BY due_date ASC
    `).all(startDate.toISOString(), endDate.toISOString()) as any[];

    return tasks.map(task => ({
      ...task,
      subtasks: this.getSubtasks(task.id),
    }));
  },

  filterByPriority(priority: Priority): Task[] {
    const tasks = db.prepare('SELECT * FROM tasks WHERE priority = ? ORDER BY created_at DESC').all(priority) as any[];
    return tasks.map(task => ({
      ...task,
      subtasks: this.getSubtasks(task.id),
    }));
  },

  filterByStatus(status: TaskStatus): Task[] {
    const tasks = db.prepare('SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC').all(status) as any[];
    return tasks.map(task => ({
      ...task,
      subtasks: this.getSubtasks(task.id),
    }));
  },

  search(query: string): Task[] {
    const tasks = db.prepare(`
      SELECT * FROM tasks 
      WHERE title LIKE ? OR description LIKE ?
      ORDER BY created_at DESC
    `).all(`%${query}%`, `%${query}%`) as any[];
    
    return tasks.map(task => ({
      ...task,
      subtasks: this.getSubtasks(task.id),
    }));
  },
};
