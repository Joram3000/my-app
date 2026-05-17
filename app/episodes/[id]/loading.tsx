import Link from "next/link";
import { BiLeftArrowAlt } from "react-icons/bi";
import styles from "./page.module.css";
import { EpisodeDetailSkeleton } from "@/ui/skeletons";

export default function Loading() {
  return (
    <div className={styles.container}>
      <Link href="/episodes" className={styles.backLink}>
        <BiLeftArrowAlt /> Back to episodes
      </Link>
      <EpisodeDetailSkeleton />
    </div>
  );
}
