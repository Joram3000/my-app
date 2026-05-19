"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/use-sound";
import { useSplash } from "@/context/ui-context";

export function GlobalSound() {
  const { play } = useSound();
  const { splashDismissed } = useSplash();

  useEffect(() => {
    if (!splashDismissed) return;
    document.addEventListener("click", play);
    return () => document.removeEventListener("click", play);
  }, [play, splashDismissed]);

  return null;
}
