import Link from "next/link";
import { BiLeftArrowAlt } from "react-icons/bi";
import styles from "./page.module.css";
import { CharacterDetailSkeleton } from "@/ui/skeletons";

export default function Loading() {
  return (
    <div className={styles.container}>
      <Link href="/characters" className={styles.backLink}>
        <BiLeftArrowAlt /> Back to characters
      </Link>
      <CharacterDetailSkeleton />
    </div>
  );
}
