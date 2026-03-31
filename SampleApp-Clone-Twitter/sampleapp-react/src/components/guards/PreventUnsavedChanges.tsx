import type { ReactNode } from 'react';
import { usePreventUnsavedChanges } from '../../hooks/usePreventUnsavedChanges';
import { ConfirmDialog } from './ConfirmDialog';

type PreventUnsavedChangesProps = {
  isDirty: boolean;
  message?: string;
  title?: string;
  children: (args: { confirmNavigate: (action: () => void) => void }) => ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const PreventUnsavedChanges = ({
  isDirty,
  message = 'У вас есть несохраненные изменения. Вы действительно хотите покинуть страницу?',
  title = 'Несохраненные изменения',
  children,
  onConfirm,
  onCancel,
}: PreventUnsavedChangesProps) => {
  const {
    isDialogOpen,
    confirmNavigate,
    confirmNavigation,
    cancelNavigation,
  } = usePreventUnsavedChanges({
    isDirty,
    message,
    onConfirm,
    onCancel,
  });

  return (
    <>
      {children({ confirmNavigate })}
      <ConfirmDialog
        open={isDialogOpen}
        title={title}
        message={message}
        confirmText="Покинуть страницу"
        cancelText="Остаться"
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
        severity="warning"
      />
    </>
  );
};