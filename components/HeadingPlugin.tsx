"use client";
import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical';
import { $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { FORMAT_HEADING_COMMAND } from '@/lib/commands';

export default function HeadingPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      FORMAT_HEADING_COMMAND,
      (level) => {
        console.log('Applying heading:', level);
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const element = anchorNode.getTopLevelElementOrThrow();
            console.log('Current element type:', element.getType());

            if ($isHeadingNode(element)) {
              if (element.getTag() === level) {
                // Same heading level clicked, revert to paragraph
                const paragraphNode = $createParagraphNode();
                paragraphNode.append(...element.getChildren());
                element.replace(paragraphNode);
                console.log('Reverted to paragraph');
              } else {
                // Different heading level, replace with new heading
                const newHeadingNode = $createHeadingNode(level);
                newHeadingNode.append(...element.getChildren());
                element.replace(newHeadingNode);
                console.log('Changed heading to:', level);
              }
            } else {
              // Assume it’s a paragraph or other block, transform to heading
              const headingNode = $createHeadingNode(level);
              headingNode.append(...element.getChildren());
              element.replace(headingNode);
              console.log('Transformed to heading:', level);
            }
          }
        });
        return true;
      },
      0
    );
  }, [editor]);

  return null;
}