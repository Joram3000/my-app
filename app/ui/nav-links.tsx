"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./nav-links.module.css";
import { ROUTES } from "@/lib/routes";
import { useSound } from "@/hooks/use-sound";

export function NavLinks() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { play } = useSound();

  return (
    <>
      <button
        className={styles.burgerButton}
        onClick={() => { play(); setIsOpen(!isOpen); }}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span
          className={`${styles.burgerLine} ${isOpen ? styles.burgerLineTop : ""}`}
        />
        <span
          className={`${styles.burgerLine} ${isOpen ? styles.burgerLineMid : ""}`}
        />
        <span
          className={`${styles.burgerLine} ${isOpen ? styles.burgerLineBot : ""}`}
        />
      </button>

      <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ""}`}>
        {ROUTES.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.link} ${pathname.startsWith(href) ? styles.active : styles.inactive}`}
            onClick={() => { play(); setIsOpen(false); }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
