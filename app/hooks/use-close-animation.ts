"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseCloseAnimationOptions {
  onClose: () => void;
  dialogRef: React.RefObject<HTMLElement | null>;
}

export function useCloseAnimation({ onClose, dialogRef }: UseCloseAnimationOptions) {
  const [isClosing, setIsClosing] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button, a[href]")?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [dialogRef]);

  const triggerClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    if (isClosing) onCloseRef.current();
  }, [isClosing]);

  return { isClosing, triggerClose, handleAnimationEnd };
}
