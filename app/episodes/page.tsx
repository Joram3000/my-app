import { Suspense } from "react";
import { type Metadata } from "next";

import styles from "./page.module.css";
import { fetchEpisodes } from "@/lib/api/rickMorty/rickMorty";
import { EpisodeList } from "@/ui/episode-list";
import { FilterBar } from "@/ui/filter-bar";

export const metadata: Metadata = { title: "Episodes" };

const EPISODE_FILTERS = [
  { type: "text" as const, key: "name", placeholder: "Search by name…" },
  {
    type: "text" as const,
    key: "episode",
    placeholder: "Episode code (e.g. S01E01)…",
  },
];

type SearchParams = Promise<{ name?: string; episode?: string }>;

export default function EpisodesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Episodes</h1>
      <Suspense>
        <FilterBar filters={EPISODE_FILTERS} />
      </Suspense>
      <Suspense fallback={<p>Loading...</p>}>
        <EpisodesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function EpisodesContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = { name: params.name, episode: params.episode };
  const data = await fetchEpisodes(1, filters);

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
