import styles from "./page.module.css";
import { CharacterGridSkeleton, CountSkeleton, FilterBarSkeleton } from "@/ui/skeletons";
import { CHARACTER_FILTERS } from "@/lib/filters";

export default function Loading() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Characters</h1>
      <FilterBarSkeleton filters={CHARACTER_FILTERS} />
      <CountSkeleton />
      <CharacterGridSkeleton />
    </div>
  );
}
