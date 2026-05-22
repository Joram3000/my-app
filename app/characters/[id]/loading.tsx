import shared from "@/ui/detail-page.module.css";
import { CharacterDetailSkeleton } from "@/ui/skeletons";
import { Backlink } from "@/ui/backlink";

export default function Loading() {
  return (
    <div className={shared.container}>
      <Backlink label={"Back to characters"} href={"/characters"} />
      <CharacterDetailSkeleton />
    </div>
  );
}
