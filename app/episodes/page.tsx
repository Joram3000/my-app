import { Suspense } from "react";
import { type Metadata } from "next";
import Link from "next/link";

import styles from "./page.module.css";
import { fetchEpisodes } from "@/lib/api/rickMorty/rickMorty";
import { SeasonBrowser } from "@/ui/season-browser";
import { EpisodeList } from "@/ui/episode-list";
import { FilterBar } from "@/ui/filter-bar";

import { EPISODE_FILTERS } from "@/lib/api/rickMorty/filters";
import {
  CountSkeleton,
  EpisodeListSkeleton,
  FilterBarSkeleton,
} from "@/ui/skeletons";

export const metadata: Metadata = { title: "Episodes" };

type SearchParams = Promise<{
  name?: string;
  episode?: string;
  season?: string;
  view?: string;
}>;

export default function EpisodesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="pageContainer">
      <h1 className="pageHeading">Episodes</h1>
      <Suspense fallback={<FilterBarSkeleton filters={EPISODE_FILTERS} />}>
        <FilterBar filters={EPISODE_FILTERS} />
      </Suspense>
      <Suspense
        fallback={
          <>
            <CountSkeleton />
            <EpisodeListSkeleton />
          </>
        }
      >
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
  const view = params.view === "season" ? "season" : "list";
  const activeSeason = params.season ? Number(params.season) : null;

  const toggleHref = buildToggleHref(params, view);

  if (view === "list") {
    const data = await fetchEpisodes(1, {
      name: params.name,
      episode: params.episode,
    });
    return (
      <>
        <ViewToggle view={view} toggleHref={toggleHref} />
        <EpisodeList initialEpisodes={data.results} initialInfo={data.info} />
      </>
    );
  }

  const data = await fetchEpisodes(1, {
    name: params.name,
    episode: params.episode,
  });

  return (
    <>
      <ViewToggle view={view} toggleHref={toggleHref} />
      <p className="pageCount">
        {data.info.count > 0
          ? `${data.info.count} episodes`
          : "No episodes found"}
      </p>
      <SeasonBrowser
        initialEpisodes={data.results}
        initialInfo={data.info}
        activeSeason={activeSeason}
        nameFilter={params.name}
        episodeFilter={params.episode}
      />
    </>
  );
}

function ViewToggle({
  view,
  toggleHref,
}: {
  view: "season" | "list";
  toggleHref: string;
}) {
  return (
    <div className={styles.viewToggle}>
      <Link
        href={toggleHref}
        className={styles.toggleBtn}
        title={
          view === "season" ? "Switch to list view" : "Switch to season view"
        }
      >
        {view === "season" ? "List view" : "Season view"}
      </Link>
    </div>
  );
}

function buildToggleHref(
  params: Awaited<SearchParams>,
  currentView: "season" | "list",
): string {
  const nextView = currentView === "season" ? "list" : "season";
  const search = new URLSearchParams();
  if (params.name) search.set("name", params.name);
  if (params.episode) search.set("episode", params.episode);
  search.set("view", nextView);
  return `/episodes?${search.toString()}`;
}
