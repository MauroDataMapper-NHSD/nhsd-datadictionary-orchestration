import { Button, Modal, Stack, Text, Textarea } from '@mantine/core';
import { RichTextEditor } from '@mantine/tiptap';
import { IconCode, IconEye, IconLinkPlus } from '@tabler/icons-react';
import Link from '@tiptap/extension-link';
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import type { KeyboardEvent as ReactKeyboardEvent, ReactElement } from 'react';
import { useCallback, useEffect, useState } from 'react';

export interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  stickyOffset?: number;
}

function isDictionaryInsertShortcut(event: KeyboardEvent): boolean {
  return (event.ctrlKey || event.metaKey) && event.code === 'Space';
}

export function HtmlEditor({ value, onChange, stickyOffset = 60 }: HtmlEditorProps): ReactElement {
  const [sourceMode, setSourceMode] = useState(false);
  const [sourceValue, setSourceValue] = useState(value);
  const [insertDictionaryDialogOpen, setInsertDictionaryDialogOpen] = useState(false);

  const openInsertDictionaryDialog = useCallback(() => {
    setInsertDictionaryDialogOpen(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell
    ],
    content: value,
    onUpdate: ({ editor: currentEditor }) => {
      if (!sourceMode) {
        onChange(currentEditor.getHTML());
      }
    }
  });

  useEffect(() => {
    if (sourceMode) {
      setSourceValue(value);
      return;
    }

    if (!editor) {
      return;
    }

    if (editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, sourceMode, value]);

  useEffect(() => {
    if (!editor) {
      return;
    }

    const element = editor.view.dom;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isDictionaryInsertShortcut(event)) {
        return;
      }

      event.preventDefault();
      openInsertDictionaryDialog();
    };

    element.addEventListener('keydown', onKeyDown);
    return () => element.removeEventListener('keydown', onKeyDown);
  }, [editor, openInsertDictionaryDialog]);

  const toggleSourceMode = () => {
    if (!sourceMode) {
      setSourceValue(editor?.getHTML() ?? value);
      setSourceMode(true);
      return;
    }

    editor?.commands.setContent(sourceValue, { emitUpdate: false });
    onChange(sourceValue);
    setSourceMode(false);
  };

  const handleSourceEditorKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (!isDictionaryInsertShortcut(event.nativeEvent)) {
      return;
    }

    event.preventDefault();
    openInsertDictionaryDialog();
  };

  return (
    <>
      <RichTextEditor
        editor={editor}
        styles={{
          content: {
            '& table': {
              borderCollapse: 'collapse',
              tableLayout: 'fixed',
              width: '100%'
            },
            '& td, & th': {
              border: '1px solid var(--mantine-color-gray-4)',
              padding: '0.5rem',
              verticalAlign: 'top'
            },
            '& th': {
              backgroundColor: 'var(--mantine-color-gray-0)',
              fontWeight: 600
            }
          }
        }}
      >
        <RichTextEditor.Toolbar sticky stickyOffset={stickyOffset}>
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control
              onClick={toggleSourceMode}
              aria-label={sourceMode ? 'Switch to visual mode' : 'Switch to source code mode'}
              title={sourceMode ? 'Visual mode' : 'Source code mode'}
            >
              {sourceMode ? <IconEye size={16} stroke={2} /> : <IconCode size={16} stroke={2} />}
            </RichTextEditor.Control>
          </RichTextEditor.ControlsGroup>

          {!sourceMode && (
            <>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Blockquote />
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Control
                  aria-label='Insert table'
                  title='Insert table'
                  onClick={() =>
                    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                  }
                >
                  Table
                </RichTextEditor.Control>
                <RichTextEditor.Control
                  aria-label='Add table row'
                  title='Add table row'
                  onClick={() => editor?.chain().focus().addRowAfter().run()}
                >
                  + Row
                </RichTextEditor.Control>
                <RichTextEditor.Control
                  aria-label='Add table column'
                  title='Add table column'
                  onClick={() => editor?.chain().focus().addColumnAfter().run()}
                >
                  + Col
                </RichTextEditor.Control>
                <RichTextEditor.Control
                  aria-label='Delete table'
                  title='Delete table'
                  onClick={() => editor?.chain().focus().deleteTable().run()}
                >
                  Del Table
                </RichTextEditor.Control>
              </RichTextEditor.ControlsGroup>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>
            </>
          )}

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control
              onClick={openInsertDictionaryDialog}
              aria-label='Insert Link to Dictionary Item'
              title='Insert Link to Dictionary Item'
            >
              <IconLinkPlus size={16} stroke={2} />
            </RichTextEditor.Control>
          </RichTextEditor.ControlsGroup>
        </RichTextEditor.Toolbar>

        {sourceMode ? (
          <Textarea
            minRows={12}
            autosize
            value={sourceValue}
            onChange={(event) => setSourceValue(event.currentTarget.value)}
            onKeyDown={handleSourceEditorKeyDown}
            aria-label='HTML source editor'
          />
        ) : (
          <RichTextEditor.Content />
        )}
      </RichTextEditor>

      <Modal
        data-modal-role='html-editor-dictionary-link'
        opened={insertDictionaryDialogOpen}
        onClose={() => setInsertDictionaryDialogOpen(false)}
        title='Insert Link to Dictionary Item'
        size='sm'
        centered
      >
        <Stack gap='sm'>
          <Text size='sm' c='dimmed'>
            Dictionary item selector will be added here.
          </Text>
          <Button variant='default' onClick={() => setInsertDictionaryDialogOpen(false)}>
            Close
          </Button>
        </Stack>
      </Modal>
    </>
  );
}






