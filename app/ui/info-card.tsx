import Link from "next/link";
import styles from "./info-card.module.css";

interface InfoCardProps {
  label: string;
  value: string;
  href?: string;
}

export function InfoCard({ label, value, href }: InfoCardProps) {
  return (
    <div className={styles.infoCard}>
      <dt className={styles.infoLabel}>{label}</dt>
      <dd className={styles.infoValue}>
        {href ? (
          <Link href={href} className={styles.locationLink}>
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
