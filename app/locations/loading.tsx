import styles from "./page.module.css";
import { CountSkeleton, FilterBarSkeleton, LocationGridSkeleton } from "@/ui/skeletons";
import { LOCATION_FILTERS } from "@/lib/filters";

export default function Loading() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Locations</h1>
      <FilterBarSkeleton filters={LOCATION_FILTERS} />
      <CountSkeleton />
      <LocationGridSkeleton />
    </div>
  );
}
