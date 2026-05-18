"use client";

import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <a
        href="https://www.joramkroon.com"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.footerText}
      >
        Made by Joram Kroon
      </a>
    </footer>
  );
}
