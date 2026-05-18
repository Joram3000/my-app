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
            className={styles.cursor}
            aria-label="Toggle sound"
            onClick={() => { if (!soundActive) playRaw(); toggleSound(); }}
          >
            {soundActive ? <BiVolumeFull /> : <BiVolume />}
          </button>
          <button
            className={styles.cursor}
            aria-label="Toggle cursor"
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
