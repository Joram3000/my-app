"use client";

import { useEffect, useRef } from "react";
import { useSound } from "@/context/ui-context";
import { useSound as useSoundPlayer } from "@/hooks/use-sound";

export function SoundEffects() {
  const { soundActive } = useSound();
  const { play: playImin } = useSoundPlayer("/sounds/imin.mp3");
  const prev = useRef(soundActive);

  useEffect(() => {
    if (!prev.current && soundActive) playImin();
    prev.current = soundActive;
  }, [soundActive, playImin]);

  return null;
}
