"use client";

import { useCallback, useEffect, useRef } from "react";
import { useSound as useSoundContext } from "@/context/ui-context";

let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!sharedContext) {
    sharedContext = new AudioContext();
  }
  return sharedContext;
}

export function useSound(src = "/sounds/laser1.mp3") {
  const { soundActive } = useSoundContext();
  const bufferRef = useRef<AudioBuffer | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;

    async function load() {
      const ctx = getAudioContext();
      if (!ctx) return;

      try {
        const res = await fetch(src);
        const arrayBuffer = await res.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        if (!cancelled) bufferRef.current = audioBuffer;
      } catch {
        // sound file not found or decode failed — silent fail
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [src]);

  const playBuffer = useCallback((buffer: AudioBuffer) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  }, []);

  const play = useCallback(() => {
    if (!bufferRef.current || !soundActive) return;
    playBuffer(bufferRef.current);
  }, [soundActive, playBuffer]);

  // Play regardless of soundActive — for the toggle itself
  const playRaw = useCallback(() => {
    if (!bufferRef.current) return;
    playBuffer(bufferRef.current);
  }, [playBuffer]);

  return { play, playRaw };
}
