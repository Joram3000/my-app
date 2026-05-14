import Link from "next/link";
import styles from "./Header.module.css";
import { NavLinks } from "@/ui/nav-links";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/characters" className={styles.logoLink}>
          <span className={styles.logoIcon}>
            <img src="/image/bananamorty.webp" alt="bananaMorty" />
          </span>
          <span className={styles.logoText}>Rick &amp; Morty</span>
        </Link>
        <NavLinks />
      </div>
    </header>
  );
}
