"use client";
import { useEffect, useState, useRef } from 'react';
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
import debounce from 'lodash.debounce';
import { useSpring, animated } from '@react-spring/web';
import { $getRoot } from 'lexical';

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
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (document?.content && !hasLoaded.current) {
      const parsedState = editor.parseEditorState(JSON.parse(document.content));
      editor.setEditorState(parsedState);
      hasLoaded.current = true;
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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const previousStateRef = useRef<string | null>(null);

  // Animation for save banner
  const springProps = useSpring({
    opacity: saveStatus === 'idle' ? 0 : 1,
    transform: saveStatus === 'idle' ? 'translateY(-20px)' : 'translateY(0)',
    config: { tension: 200, friction: 20 },
  });

  // Debounced save with 2-second delay
  const debouncedSave = debounce(async (stateJson: string) => {
    try {
      setSaveStatus('saving');
      await updateDocument(stateJson);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('idle');
      console.error('Save failed:', error); // Log error to console instead of toast
    }
  }, 2000);

  // Load document on mount
  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  // Save on change with content validation
  function onChange(editor: LexicalEditor, editorState: any) {
    editorState.read(() => {
      const stateJson = JSON.stringify(editorState.toJSON());
      // Only save if the state has changed
      if (stateJson !== previousStateRef.current) {
        previousStateRef.current = stateJson;
        debouncedSave(stateJson);
      }
    });
  }

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative ">
        {/* Save status banner */}
        {/* <animated.div
          style={springProps}
          className="absolute top-0 right-0 bg-slate-900 text-white px-4 py-2 rounded-bl-md"
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
        </animated.div> */}
        <Toolbar />
        <div className="relative border rounded-md p-4 min-h-[200px] overflow-y-auto">
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
      </div>
    </LexicalComposer>
  );
}