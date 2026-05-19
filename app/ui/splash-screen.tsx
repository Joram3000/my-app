"use client";

import Image from "next/image";
import styles from "./splash-screen.module.css";
import { BiVolumeFull, BiVolumeMute } from "react-icons/bi";
import { useSplash } from "@/context/ui-context";
import { useSound as useSoundPlayer } from "@/hooks/use-sound";

export function SplashScreen() {
  const { splashDismissed, dismissSplash } = useSplash();
  const { playDirect: playImin } = useSoundPlayer("/sounds/imin.mp3");

  if (splashDismissed !== false) return null;

  return (
    <div className={styles.overlay}>
      <Image
        src="/image/rickmortysplash.webp"
        alt=""
        className={styles.img}
        fill
        priority
        style={{ objectFit: "cover" }}
      />
      <div className={styles.content}>
        <h1 className={styles.title}>
          Welcome to the Rick &amp; Morty Universe
        </h1>

        <div className={styles.buttons}>
          <button className={styles.btn} onClick={() => { playImin(); dismissSplash(true); }}>
            <BiVolumeFull />
          </button>
          <button className={styles.btn} onClick={() => dismissSplash(false)}>
            <BiVolumeMute />
          </button>
        </div>
      </div>
    </div>
  );
}
