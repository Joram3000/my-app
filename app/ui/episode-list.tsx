"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import styles from "./episode-list.module.css";
import { Episode, ApiInfo } from "@/lib/api/rickMorty/rickMorty.types";
import { fetchEpisodes } from "@/lib/api/rickMorty/rickMorty";
import { BiRightArrowAlt } from "react-icons/bi";
import { TiltGrid } from "./tilt-grid";

interface EpisodeListProps {
  initialEpisodes: Episode[];
  initialInfo: ApiInfo;
}

export function EpisodeList({
  initialEpisodes,
  initialInfo,
}: EpisodeListProps) {
  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
  const [info, setInfo] = useState<ApiInfo>(initialInfo);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  async function loadMore() {
    const nextPage = page + 1;

    startTransition(async () => {
      try {
        const data = await fetchEpisodes(nextPage);
        setEpisodes((prev) => [...prev, ...data.results]);
        setInfo(data.info);
        setPage(nextPage);
      } catch {
        // silently ignore — button stays enabled for retry
      }
    });
  }

  if (episodes.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>No episodes found.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.list}>
        <TiltGrid>
          {episodes.map((ep) => (
            <EpisodeRow key={ep.id} episode={ep} />
          ))}
        </TiltGrid>
      </div>

      {info.next && (
        <div className={styles.loadMoreWrapper}>
          <button
            onClick={loadMore}
            disabled={isPending}
            className={styles.loadMoreBtn}
          >
            {isPending ? (
              <>
                <span className={styles.spinnerIcon} />
                Loading…
              </>
            ) : (
              "Load more episodes"
            )}
          </button>
        </div>
      )}

      <p className={styles.count}>
        Showing {episodes.length} of {info.count} episodes
      </p>
    </>
  );
}

function EpisodeRow({ episode }: { episode: Episode }) {
  return (
    <Link href={`/episodes/${episode.id}`} className={styles.row}>
      <div className={styles.episodeCode}>{episode.episode}</div>
      <div className={styles.rowInfo}>
        <h3 className={styles.rowTitle}>{episode.name}</h3>
        <p className={styles.rowDate}>{episode.air_date}</p>
      </div>
      <span className={styles.rowArrow}>
        <BiRightArrowAlt />
      </span>
    </Link>
  );
}
