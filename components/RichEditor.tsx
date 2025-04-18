"use client";
import { useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { LexicalEditor } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import Toolbar from './Toolbar';
import HeadingPlugin from './HeadingPlugin';
import CustomErrorBoundary from './CustomErrorBoundary';
import { useEditorStore } from '@/store/editorStore';

const editorConfig = {
  namespace: 'TextEditor',
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
  onError(error: Error) {
    console.error(error);
  },
  theme: {
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
    },
    heading: {
      h1: 'text-4xl font-bold',
      h2: 'text-3xl font-bold',
      h3: 'text-2xl font-bold',
    },
  },
};

const placeholder = (
  <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
    Start typing...
  </div>
);

// Plugin to load initial content from the store using JSON
function InitialContentPlugin() {
  const [editor] = useLexicalComposerContext();
  const { document } = useEditorStore();

  useEffect(() => {
    if (document?.state) {
      const parsedState = editor.parseEditorState(JSON.parse(document.state));
      editor.setEditorState(parsedState);
    }
  }, [editor, document]);

  return null;
}

// Plugin to save content on change using JSON
function OnChangePlugin({ onChange }: { onChange: (editor: LexicalEditor, editorState: any) => void }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      onChange(editor, editorState);
    });
  }, [editor, onChange]);
  return null;
}

export default function RichEditor() {
  const { loadDocument, updateDocument } = useEditorStore();

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  function onChange(editor: LexicalEditor, editorState: any) {
    const stateJson = JSON.stringify(editorState.toJSON());
    updateDocument(stateJson);
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Toolbar />
      <div className="relative border rounded-md p-4 min-h-[200px]">
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-content outline-none" />}
          placeholder={placeholder}
          ErrorBoundary={CustomErrorBoundary}
        />
        <HeadingPlugin />
        <HistoryPlugin />
        <InitialContentPlugin />
        <OnChangePlugin onChange={onChange} />
      </div>
    </LexicalComposer>
  );
}