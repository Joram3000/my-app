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

      <div className={styles.settings}>
        <div className={styles.setting}>
          <p>Settings</p>
          <p>Cursor: Rocket / Normal</p>
        </div>
        <div className={styles.setting}>
          <p>Cursor: Sound Effects On/Off</p>
          <p>Volume 1 2 3 4 5</p>
        </div>
      </div>
    </footer>
  );
}
