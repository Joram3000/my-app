import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.message}>
        Looks like this dimension doesn&apos;t exist.
      </p>
      <Link href="/characters" className={styles.link}>
        Back to characters
      </Link>
    </div>
  );
}
