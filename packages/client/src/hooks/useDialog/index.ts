import { useState } from "react";

interface UseDialog {
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;
}

const useDialog = (): UseDialog => {
  const [open, setOpen] = useState<boolean>(false);

  const toggleDialog = (): void => setOpen((open) => !open);

  const openDialog = (): void => setOpen(true);

  const closeDialog = (): void => setOpen(false);

  return {
    open,
    openDialog,
    closeDialog,
    toggleDialog,
  };
};

export default useDialog;
