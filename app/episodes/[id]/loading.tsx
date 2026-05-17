import styles from "./page.module.css";
import { DetailHeaderSkeleton, InfoGridSkeleton } from "@/ui/skeletons";

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <DetailHeaderSkeleton badge />
        </div>
        <div className={styles.infoGrid}>
          <InfoGridSkeleton count={3} />
        </div>
      </div>
    </div>
  );
}
