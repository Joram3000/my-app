"use client";

import { useEffect, RefObject } from "react";

interface UseModalKeyboardOptions {
  currentIndex: number;
  hasNext: boolean;
  dialogRef: RefObject<HTMLElement | null>;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function useModalKeyboard({
  currentIndex,
  hasNext,
  dialogRef,
  onPrev,
  onNext,
  onClose,
}: UseModalKeyboardOptions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        if (currentIndex > 0) {
          onPrev();
          dialogRef.current?.focus();
        }
      } else if (e.key === "ArrowRight") {
        if (hasNext) {
          onNext();
          dialogRef.current?.focus();
        }
      } else if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          "a[href]:not([inert] *), button:not([disabled]):not([inert] *)",
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, hasNext, dialogRef, onPrev, onNext, onClose]);
}
