import { useState, useRef } from "react";

export interface UseMenu {
  open: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
  handleClose: (event: any) => void;
  anchorRef: React.RefObject<HTMLDivElement>;
}

export const useMenu = (): UseMenu => {
  const [open, setOpen] = useState<boolean>(false);

  const anchorRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (): void => setOpen((open) => !open);

  const openMenu = (): void => setOpen(true);

  const closeMenu = (): void => setOpen(false);

  const handleClose = (event: React.MouseEvent<Document, MouseEvent>): void => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  return {
    open,
    openMenu,
    closeMenu,
    toggleMenu,
    handleClose,
    anchorRef,
  };
};
