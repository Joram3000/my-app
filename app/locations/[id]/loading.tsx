import Link from "next/link";
import { BiLeftArrowAlt } from "react-icons/bi";
import shared from "@/ui/detail-page.module.css";
import { LocationDetailSkeleton } from "@/ui/skeletons";

export default function Loading() {
  return (
    <div className={shared.container}>
      <Link href="/locations" className={shared.backLink}>
        <BiLeftArrowAlt /> Back to locations
      </Link>
      <LocationDetailSkeleton />
    </div>
  );
}
