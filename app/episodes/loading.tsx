import { EpisodeListSkeleton } from "@/ui/skeletons";
import styles from "./page.module.css";

export default function Loading() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Episodes</h1>
      <EpisodeListSkeleton />
    </div>
  );
}
