"use client";

import { useState } from "react";
import { useSplash } from "@/context/ui-context";
import styles from "./splash-screen.module.css";
import { BiVolumeFull, BiVolumeMute } from "react-icons/bi";
import { useSound as useSoundPlayer } from "@/hooks/use-sound";

export function SplashScreen() {
  const { splashDismissed, dismissSplash } = useSplash();
  const [hiding, setHiding] = useState(false);
  const { playRaw } = useSoundPlayer("/sounds/imin.mp3");

  if (splashDismissed) return null;

  function handleChoice(withSound: boolean) {
    if (withSound) playRaw();
    setHiding(true);
    setTimeout(() => dismissSplash(withSound), 500);
  }

  return (
    <div className={`${styles.overlay} ${hiding ? styles.hiding : ""}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Welcome to the Rick &amp; Morty Universe
        </h1>

        <div className={styles.buttons}>
          <button className={styles.btn} onClick={() => handleChoice(true)}>
            <BiVolumeFull />
          </button>
          <button className={styles.btn} onClick={() => handleChoice(false)}>
            <BiVolumeMute />
          </button>
        </div>
      </div>
    </div>
  );
}
