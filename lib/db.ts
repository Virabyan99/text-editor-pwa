// src/lib/db.ts
import Dexie, { Table } from 'dexie';

// Define the document interface
export interface Document {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

// Create the database class
export class EditorDB extends Dexie {
  documents!: Table<Document>;

  constructor() {
    super('EditorDB');
    this.version(1).stores({
      documents: 'id, title, updatedAt',
    });
  }
}

export const db = new EditorDB();