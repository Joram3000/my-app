import styles from "./page.module.css";
import { LocationDetailSkeleton } from "@/ui/skeletons";

export default function Loading() {
  return (
    <div className={styles.container}>
      <LocationDetailSkeleton />
    </div>
  );
}
