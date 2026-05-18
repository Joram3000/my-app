"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/use-sound";

export function GlobalSound() {
  const { play } = useSound("/sounds/laser1.mp3");

  useEffect(() => {
    document.addEventListener("click", play);
    return () => document.removeEventListener("click", play);
  }, [play]);

  return null;
}
