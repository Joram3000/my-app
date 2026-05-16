"use client";

import { useEffect } from "react";

export function DevOutlineToggle() {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "o") {
        e.preventDefault();
        document.body.classList.toggle("outline-enabled");
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return null;
}
