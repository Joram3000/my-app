import styles from "./page.module.css";
import { CountSkeleton, EpisodeListSkeleton, FilterBarSkeleton } from "@/ui/skeletons";
import { EPISODE_FILTERS } from "@/lib/filters";

export default function Loading() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Episodes</h1>
      <FilterBarSkeleton filters={EPISODE_FILTERS} />
      <CountSkeleton />
      <EpisodeListSkeleton />
    </div>
  );
}
