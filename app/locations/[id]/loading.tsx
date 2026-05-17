import Link from "next/link";
import { BiLeftArrowAlt } from "react-icons/bi";
import styles from "./page.module.css";
import { LocationDetailSkeleton } from "@/ui/skeletons";

export default function Loading() {
  return (
    <div className={styles.container}>
      <Link href="/locations" className={styles.backLink}>
        <BiLeftArrowAlt /> Back to locations
      </Link>
      <LocationDetailSkeleton />
    </div>
  );
}
