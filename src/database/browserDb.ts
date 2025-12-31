interface Database {
  prepare: (sql: string) => Statement;
  exec: (sql: string) => void;
  transaction: (fn: () => void) => () => void;
  pragma: (pragma: string) => void;
}

interface Statement {
  run: (...params: any[]) => void;
  get: (...params: any[]) => any;
  all: (...params: any[]) => any[];
}

class BrowserDatabase implements Database {
  private getStore(key: string): any[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  private setStore(key: string, data: any[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  pragma(_pragma: string): void {
    // No-op for browser
  }

  exec(_sql: string): void {
    // Initialize stores if they don't exist
    const stores = ['tasks', 'subtasks', 'notes', 'events', 'habits', 'habit_logs', 'routines', 'settings'];
    stores.forEach(store => {
      if (!localStorage.getItem(store)) {
        this.setStore(store, []);
      }
    });

    // Initialize default settings
    const settings = this.getStore('settings');
    if (settings.length === 0) {
      this.setStore('settings', [
        { key: 'theme', value: 'light' },
        { key: 'colorScheme', value: 'blue' },
      ]);
    }
  }

  prepare(sql: string): Statement {
    const sqlLower = sql.toLowerCase().trim();
    
    return {
      run: (...params: any[]) => {
        if (sqlLower.startsWith('insert')) {
          this.handleInsert(sql, params);
        } else if (sqlLower.startsWith('update')) {
          this.handleUpdate(sql, params);
        } else if (sqlLower.startsWith('delete')) {
          this.handleDelete(sql, params);
        }
      },
      get: (...params: any[]) => {
        return this.handleSelect(sql, params, true);
      },
      all: (...params: any[]) => {
        return this.handleSelect(sql, params, false);
      },
    };
  }

  transaction(fn: () => void): () => void {
    return () => {
      fn();
    };
  }

  private getTableName(sql: string): string {
    const match = sql.match(/(?:from|into|update|table)\s+(\w+)/i);
    return match ? match[1] : '';
  }

  private handleInsert(sql: string, params: any[]): void {
    const table = this.getTableName(sql);
    const data = this.getStore(table);
    
    // Parse column names from INSERT statement
    const columnsMatch = sql.match(/\(([^)]+)\)/);
    if (!columnsMatch) return;
    
    const columns = columnsMatch[1].split(',').map(c => c.trim());
    const row: any = {};
    columns.forEach((col, i) => {
      row[col] = params[i];
    });
    
    // Handle INSERT OR REPLACE
    if (sql.toLowerCase().includes('or replace') || sql.toLowerCase().includes('or ignore')) {
      const existingIndex = data.findIndex((item: any) => {
        if (table === 'settings' && item.key === row.key) return true;
        if (table === 'habit_logs' && item.habit_id === row.habit_id && item.date === row.date) return true;
        return item.id === row.id;
      });
      
      if (existingIndex >= 0) {
        if (sql.toLowerCase().includes('or replace')) {
          data[existingIndex] = row;
        }
        // or ignore: do nothing if exists
      } else {
        data.push(row);
      }
    } else {
      data.push(row);
    }
    
    this.setStore(table, data);
  }

  private handleUpdate(sql: string, params: any[]): void {
    const table = this.getTableName(sql);
    const data = this.getStore(table);
    
    // Get the ID from the last parameter (WHERE id = ?)
    const id = params[params.length - 1];
    
    // Parse SET clauses
    const setMatch = sql.match(/set\s+(.*?)\s+where/i);
    if (!setMatch) return;
    
    const setClauses = setMatch[1].split(',').map(c => c.trim());
    const updates: any = {};
    setClauses.forEach((clause, i) => {
      const [col] = clause.split('=').map(s => s.trim());
      updates[col] = params[i];
    });
    
    const index = data.findIndex((item: any) => item.id === id);
    if (index >= 0) {
      data[index] = { ...data[index], ...updates };
      this.setStore(table, data);
    }
  }

  private handleDelete(sql: string, params: any[]): void {
    const table = this.getTableName(sql);
    let data = this.getStore(table);
    
    if (sql.toLowerCase().includes('where')) {
      // Extract the condition
      const whereMatch = sql.match(/where\s+(\w+)\s*=\s*\?/i);
      if (whereMatch) {
        const column = whereMatch[1];
        const value = params[0];
        data = data.filter((item: any) => item[column] !== value);
      }
    } else {
      // DELETE without WHERE - clear all
      data = [];
    }
    
    this.setStore(table, data);
  }

  private handleSelect(sql: string, params: any[], single: boolean): any {
    const table = this.getTableName(sql);
    let data = this.getStore(table);
    
    // Handle WHERE clause
    if (sql.toLowerCase().includes('where')) {
      const whereMatch = sql.match(/where\s+(\w+)\s*=\s*\?/i);
      if (whereMatch) {
        const column = whereMatch[1];
        const value = params[0];
        data = data.filter((item: any) => item[column] === value);
      }
      
      // Handle LIKE
      const likeMatch = sql.match(/where\s+(\w+)\s+like\s+\?/i);
      if (likeMatch) {
        const column = likeMatch[1];
        const value = params[0].replace(/%/g, '');
        data = data.filter((item: any) => 
          item[column] && item[column].toString().toLowerCase().includes(value.toLowerCase())
        );
      }
      
      // Handle >= and <=
      const rangeMatch = sql.match(/where\s+(\w+)\s*>=\s*\?\s+and\s+\w+\s*<=\s*\?/i);
      if (rangeMatch) {
        const column = rangeMatch[1];
        const start = params[0];
        const end = params[1];
        data = data.filter((item: any) => item[column] >= start && item[column] <= end);
      }
    }
    
    // Handle ORDER BY
    if (sql.toLowerCase().includes('order by')) {
      const orderMatch = sql.match(/order by\s+(\w+)\s*(asc|desc)?/i);
      if (orderMatch) {
        const column = orderMatch[1];
        const direction = orderMatch[2]?.toLowerCase() === 'desc' ? -1 : 1;
        data.sort((a: any, b: any) => {
          if (a[column] < b[column]) return -1 * direction;
          if (a[column] > b[column]) return 1 * direction;
          return 0;
        });
      }
    }
    
    // Handle DISTINCT
    if (sql.toLowerCase().includes('distinct')) {
      const columnMatch = sql.match(/select\s+distinct\s+(\w+)/i);
      if (columnMatch) {
        const column = columnMatch[1];
        const unique = [...new Set(data.map((item: any) => item[column]))];
        data = unique.map(val => ({ [column]: val }));
      }
    }
    
    return single ? (data.length > 0 ? data[0] : undefined) : data;
  }
}

export const db = new BrowserDatabase();

export const initDatabase = () => {
  db.exec('INIT');
};

export default db;
