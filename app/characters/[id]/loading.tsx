import styles from "./page.module.css";
import { CharacterDetailSkeleton } from "@/ui/skeletons";

export default function Loading() {
  return (
    <div className={styles.container}>
      <CharacterDetailSkeleton />
    </div>
  );
}
