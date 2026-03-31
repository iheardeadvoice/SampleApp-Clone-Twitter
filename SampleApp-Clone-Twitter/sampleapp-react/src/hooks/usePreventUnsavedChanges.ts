import { useCallback, useEffect, useState } from 'react';

type UsePreventUnsavedChangesProps = {
  isDirty: boolean;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const usePreventUnsavedChanges = ({
  isDirty,
  message = 'У вас есть несохраненные изменения. Вы действительно хотите покинуть страницу?',
  onConfirm,
  onCancel,
}: UsePreventUnsavedChangesProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;

      event.preventDefault();
      event.returnValue = message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, message]);

  const confirmNavigate = useCallback(
    (action: () => void) => {
      if (!isDirty) {
        action();
        return;
      }

      setPendingAction(() => action);
      setIsDialogOpen(true);
    },
    [isDirty]
  );

  const confirmNavigation = useCallback(() => {
    setIsDialogOpen(false);
    onConfirm?.();

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [onConfirm, pendingAction]);

  const cancelNavigation = useCallback(() => {
    setIsDialogOpen(false);
    setPendingAction(null);
    onCancel?.();
  }, [onCancel]);

  return {
    isDialogOpen,
    message,
    confirmNavigate,
    confirmNavigation,
    cancelNavigation,
  };
};