import { LocationGridSkeleton } from "@/ui/skeletons";
import styles from "./page.module.css";

export default function Loading() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Locations</h1>
      <LocationGridSkeleton />
    </div>
  );
}
