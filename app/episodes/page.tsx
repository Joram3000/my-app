import { Suspense } from "react";
import { type Metadata } from "next";

import styles from "./page.module.css";
import { fetchEpisodes } from "@/lib/api/rickMorty/rickMorty";
import { EpisodeList } from "@/ui/episode-list";

export const metadata: Metadata = { title: "Episodes" };

export default function EpisodesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Episodes</h1>

      <Suspense fallback={<p>Loading...</p>}>
        <EpisodesContent />
      </Suspense>
    </div>
  );
}

async function EpisodesContent() {
  const data = await fetchEpisodes(1);

  return (
    <>
      <p className={styles.count}>
        {data.info.count > 0
          ? `${data.info.count} episodes`
          : "No episodes found"}
      </p>
      <EpisodeList initialEpisodes={data.results} initialInfo={data.info} />
    </>
  );
}
