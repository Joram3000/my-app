"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import { NavLinks } from "@/ui/nav-links";
import { BiPointer, BiRocket, BiVolume, BiVolumeFull } from "react-icons/bi";
import { useCursor, useSound } from "@/context/ui-context";
import { useSound as useSoundPlayer } from "@/hooks/use-sound";

export function Header() {
  const { rocketActive, toggleRocket } = useCursor();
  const { soundActive, toggleSound } = useSound();
  const { playRaw } = useSoundPlayer("/sounds/oowee1.mp3");

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/characters" className={styles.logoLink}>
          <span className={styles.logoIcon}>
            <img src="/image/bananamorty.webp" alt="bananaMorty" />
          </span>
          <span className={styles.logoText}>Rick &amp; Morty</span>
        </Link>
        <div className={styles.nav}>
          <button
            className={`${styles.sound} tooltip tooltip--below`}
            aria-label="Toggle sound"
            data-tooltip={soundActive ? "Toggle Sound off" : "Toggle Sound on"}
            onClick={() => {
              if (!soundActive) playRaw();
              toggleSound();
            }}
          >
            {soundActive ? <BiVolumeFull /> : <BiVolume />}
          </button>
          <button
            className={`${styles.cursor} tooltip tooltip--below`}
            aria-label="Toggle cursor"
            data-tooltip={rocketActive ? "Toggle cursor" : "Toggle rocket"}
            onClick={toggleRocket}
          >
            {rocketActive ? <BiRocket /> : <BiPointer />}
          </button>

          <NavLinks />
        </div>
      </div>
    </header>
  );
}
