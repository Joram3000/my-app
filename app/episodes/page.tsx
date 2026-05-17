import { type Metadata } from "next";

import styles from "./page.module.css";
import { fetchAllEpisodes } from "@/lib/api/rickMorty/rickMorty";
import { SeasonBrowser } from "@/ui/season-browser";
import { FilterBar } from "@/ui/filter-bar";
import { Episode } from "@/lib/api/rickMorty/rickMorty.types";
import { EPISODE_FILTERS } from "@/lib/filters";

export const metadata: Metadata = { title: "Episodes" };

type SearchParams = Promise<{ name?: string; episode?: string; season?: string }>;

export default function EpisodesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Episodes</h1>
      <FilterBar filters={EPISODE_FILTERS} />
      <EpisodesContent searchParams={searchParams} />
    </div>
  );
}

async function EpisodesContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const activeSeason = params.season ? Number(params.season) : null;

  const episodes = await fetchAllEpisodes({ name: params.name });

  const seasonGroups = groupBySeason(episodes);

  return (
    <>
      <p className={styles.count}>
        {episodes.length > 0
          ? `${episodes.length} episodes`
          : "No episodes found"}
      </p>
      <SeasonBrowser seasonGroups={seasonGroups} activeSeason={activeSeason} />
    </>
  );
}

function groupBySeason(episodes: Episode[]): [number, Episode[]][] {
  const map = new Map<number, Episode[]>();
  for (const ep of episodes) {
    const match = ep.episode.match(/^S(\d+)/);
    if (!match) continue;
    const season = parseInt(match[1], 10);
    if (!map.has(season)) map.set(season, []);
    map.get(season)!.push(ep);
  }
  return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
}
