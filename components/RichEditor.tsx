"use client";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import {  HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import Toolbar from './Toolbar';
import HeadingPlugin from './HeadingPlugin';
import CustomErrorBoundary from './CustomErrorBoundary';
import { ParagraphNode } from 'lexical';

const editorConfig = {
  namespace: 'TextEditor',
  nodes: [ParagraphNode, HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
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

export default function RichEditor() {
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
      </div>
    </LexicalComposer>
  );
}