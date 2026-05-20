import Link from "next/link";
import { BiLeftArrowAlt } from "react-icons/bi";
import shared from "@/ui/detail-page.module.css";
import { EpisodeDetailSkeleton } from "@/ui/skeletons";

export default function Loading() {
  return (
    <div className={shared.container}>
      <Link href="/episodes" className={shared.backLink} >
        <BiLeftArrowAlt /> Back to episodes
      </Link>
      <EpisodeDetailSkeleton />
    </div>
  );
}
