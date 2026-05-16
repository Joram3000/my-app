'use client';

import { useEffect } from 'react';
import styles from './not-found.module.css';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.code}>500</h2>
      <p className={styles.message}>Something went wrong</p>
      <button onClick={reset} className={styles.link}>
        Try again
      </button>
    </div>
  );
}
