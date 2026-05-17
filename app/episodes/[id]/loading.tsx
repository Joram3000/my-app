import styles from "./page.module.css";
import { EpisodeDetailSkeleton } from "@/ui/skeletons";

export default function Loading() {
  return (
    <div className={styles.container}>
      <EpisodeDetailSkeleton />
    </div>
  );
}
