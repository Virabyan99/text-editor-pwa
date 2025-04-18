// src/store/editorStore.ts
import { create } from 'zustand';
import { db, Document } from '@/lib/db';

interface EditorState {
  document: Document | null;
  loadDocument: () => Promise<void>;
  updateDocument: (content: string) => Promise<void>;
}

export const useEditorStore = create<EditorState>((set) => ({
  document: null,

  loadDocument: async () => {
    const doc = await db.documents.get('default');
    if (doc) {
      set({ document: doc });
    } else {
      const newDoc: Document = {
        id: 'default',
        title: 'Untitled',
        content: '',
        updatedAt: new Date(),
      };
      await db.documents.put(newDoc);
      set({ document: newDoc });
    }
  },

  updateDocument: async (content: string) => {
    const updatedDoc: Document = {
      id: 'default',
      title: 'Untitled',
      content,
      updatedAt: new Date(),
    };
    await db.documents.put(updatedDoc);
    set({ document: updatedDoc });
  },
}));