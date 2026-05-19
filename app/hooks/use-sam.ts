"use client";

import { useCallback, useRef } from "react";
import { useSound } from "@/context/ui-context";

interface SamOptions {
  pitch?: number;
  speed?: number;
  mouth?: number;
  throat?: number;
}

export function useSam({
  pitch = 64,
  speed = 72,
  mouth = 128,
  throat = 128,
}: SamOptions = {}) {
  const { soundActive } = useSound();
  const currentRef = useRef<{ abort: (reason: unknown) => void } | null>(null);

  const speak = useCallback(
    async (text: string) => {
      if (!soundActive) return;
      currentRef.current?.abort("retriggered");
      currentRef.current = null;
      try {
        const { default: SamJs } = await import("sam-js");
        const sam = new SamJs({ pitch, speed, mouth, throat });
        const promise = sam.speak(text);
        currentRef.current = promise;
        await promise;
      } catch {
        // aborted or failed — silent
      } finally {
        currentRef.current = null;
      }
    },
    [soundActive, pitch, speed, mouth, throat],
  );

  return { speak };
}
