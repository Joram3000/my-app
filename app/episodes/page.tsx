import { Suspense } from "react";
import { type Metadata } from "next";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";

import styles from "./page.module.css";
import listStyles from "@/ui/episode-list.module.css";
import { applyParams } from "@/lib/searchParams";
import { fetchEpisodes } from "@/lib/api/rickMorty/rickMorty";
import { toApiPage, sliceForPage, buildLocalInfo } from "@/lib/customPagination";
import { SeasonBrowser } from "@/ui/season-browser";
import { Pagination } from "@/ui/pagination";
import { TiltGrid } from "@/ui/tilt-grid";
import { FilterBar } from "@/ui/filter-bar";

import { EPISODE_FILTERS } from "@/lib/api/rickMorty/filters";
import {
  CountSkeleton,
  EpisodeListSkeleton,
  FilterBarSkeleton,
} from "@/ui/skeletons";
import { Episode } from "@/lib/api/rickMorty/rickMorty.types";

export const metadata: Metadata = { title: "Rick & Morty - Episodes" };

type SearchParams = Promise<{
  page?: string;
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
    const localPage = Math.max(1, parseInt(params.page ?? "1") || 1);
    const data = await fetchEpisodes(toApiPage(localPage), {
      name: params.name,
      episode: params.episode,
    });
    const results = sliceForPage(data.results, localPage);
    const info = buildLocalInfo(data.info, localPage);

    const extraParams: Record<string, string> = { view: "list" };
    if (params.name) extraParams.name = params.name;
    if (params.episode) extraParams.episode = params.episode;

    return (
      <>
        <ViewToggle view={view} toggleHref={toggleHref} />
        <p className="pageCount">
          {data.info.count > 0
            ? `${data.info.count} episodes`
            : "No episodes found"}
        </p>
        {results.length === 0 ? (
          <div className="emptyState">
            <p className="emptyStateText">No episodes found.</p>
          </div>
        ) : (
          <TiltGrid>
            {results.map((ep) => (
              <EpisodeRow key={ep.id} episode={ep} />
            ))}
          </TiltGrid>
        )}
        <Pagination
          info={info}
          currentPage={localPage}
          basePath="/episodes"
          extraParams={extraParams}
        />
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

function EpisodeRow({ episode }: { episode: Episode }) {
  return (
    <Link href={`/episodes/${episode.id}`} className={listStyles.row}>
      <div className={listStyles.episodeCode}>{episode.episode}</div>
      <div className={listStyles.rowInfo}>
        <h3 className={listStyles.rowTitle}>{episode.name}</h3>
        <p className={listStyles.rowDate}>{episode.air_date}</p>
      </div>
      <span className={listStyles.rowArrow}>
        <BiRightArrowAlt />
      </span>
    </Link>
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
  const search = applyParams({}, { name: params.name, episode: params.episode, view: nextView });
  return `/episodes?${search}`;
}
