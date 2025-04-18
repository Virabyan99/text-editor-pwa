// Toolbar.tsx
"use client";
import { useCallback, useState, useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from 'lexical';
import { IconBold, IconItalic, IconUnderline } from '@tabler/icons-react';
import { Button } from './ui/button';
import { FORMAT_HEADING_COMMAND } from '@/lib/commands';

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [currentHeading, setCurrentHeading] = useState<string | null>(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getTopLevelElementOrThrow();
      const elementType = element.getType();
      const elementTag = element.getTag?.();

      if (elementType === 'heading' && elementTag) {
        setCurrentHeading(elementTag);
      } else {
        setCurrentHeading(null);
      }

      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const toggleBold = useCallback(() => {
    editor.focus();
    console.log('Toggling bold');
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.focus();
    console.log('Toggling italic');
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.focus();
    console.log('Toggling underline');
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  }, [editor]);

  const applyHeading = useCallback(
    (level: 'h1' | 'h2' | 'h3') => {
      editor.focus();
      console.log(`Applying heading ${level}`);
      editor.dispatchCommand(FORMAT_HEADING_COMMAND, level); // Use custom command
    },
    [editor]
  );

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={isBold ? 'default' : 'outline'}
        size="icon"
        onClick={toggleBold}
        aria-label="Bold"
      >
        <IconBold size={20} />
      </Button>
      <Button
        variant={isItalic ? 'default' : 'outline'}
        size="icon"
        onClick={toggleItalic}
        aria-label="Italic"
      >
        <IconItalic size={20} />
      </Button>
      <Button
        variant={isUnderline ? 'default' : 'outline'}
        size="icon"
        onClick={toggleUnderline}
        aria-label="Underline"
      >
        <IconUnderline size={20} />
      </Button>
      <Button
        variant={currentHeading === 'h1' ? 'default' : 'outline'}
        onClick={() => applyHeading('h1')}
        aria-label="Heading 1"
      >
        H1
      </Button>
      <Button
        variant={currentHeading === 'h2' ? 'default' : 'outline'}
        onClick={() => applyHeading('h2')}
        aria-label="Heading 2"
      >
        H2
      </Button>
      <Button
        variant={currentHeading === 'h3' ? 'default' : 'outline'}
        onClick={() => applyHeading('h3')}
        aria-label="Heading 3"
      >
        H3
      </Button>
    </div>
  );
}