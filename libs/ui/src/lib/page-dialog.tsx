import { Button, Group, Modal, Stack } from '@mantine/core';
import type { ReactElement, ReactNode } from 'react';
import { useEffect, useState } from 'react';

export interface PageDialogProps {
  opened: boolean;
  title: ReactNode;
  onClose: () => void;
  onSave: () => void | Promise<void>;
  children: ReactNode;
  saveLabel?: string;
  cancelLabel?: string;
  size?: string | number;
}

export function PageDialog({
  opened,
  title,
  onClose,
  onSave,
  children,
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  size = '95%'
}: PageDialogProps): ReactElement {
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!opened) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      const hasNestedHtmlEditorDialog = !!document.querySelector(
        '[data-modal-role="html-editor-dictionary-link"]'
      );

      if (hasNestedHtmlEditorDialog) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      onClose();
    };

    window.addEventListener('keydown', onEscape, true);
    return () => window.removeEventListener('keydown', onEscape, true);
  }, [onClose, opened]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size={size}
      centered
      withCloseButton={false}
      closeOnClickOutside={false}
      closeOnEscape={false}
      styles={{
        content: { display: 'flex', flexDirection: 'column', maxHeight: '92vh' },
        body: { flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' },
        title: { fontSize: '1.4rem', fontWeight: 800 }
      }}
    >
      <Stack gap="md">
        {children}
        <Group justify="flex-end" gap="sm">
          <Button variant="default" onClick={onClose} disabled={isSaving}>
            {cancelLabel}
          </Button>
          <Button onClick={() => void handleSave()} loading={isSaving}>
            {saveLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}



