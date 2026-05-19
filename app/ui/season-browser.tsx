"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useSound } from "@/hooks/use-sound";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Episode, ApiInfo } from "@/lib/api/rickMorty/rickMorty.types";
import { fetchEpisodes } from "@/lib/api/rickMorty/rickMorty";
import styles from "./season-browser.module.css";

interface SeasonBrowserProps {
  initialEpisodes: Episode[];
  initialInfo: ApiInfo;
  activeSeason: number | null;
  nameFilter?: string;
  episodeFilter?: string;
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

export function SeasonBrowser({
  initialEpisodes,
  initialInfo,
  activeSeason,
  nameFilter,
  episodeFilter,
}: SeasonBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rowRefs = useRef<Map<number, HTMLElement>>(new Map());
  const { play } = useSound();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
  const [info, setInfo] = useState<ApiInfo>(initialInfo);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Reset when filters change (new initialEpisodes from server)
  useEffect(() => {
    setEpisodes(initialEpisodes);
    setInfo(initialInfo);
    setPage(1);
  }, [initialEpisodes, initialInfo]);

  const loadMore = useCallback(async () => {
    if (loading || !info.next) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const data = await fetchEpisodes(nextPage, {
        name: nameFilter,
        episode: episodeFilter,
      });
      setEpisodes((prev) => [...prev, ...data.results]);
      setInfo(data.info);
      setPage(nextPage);
    } finally {
      setLoading(false);
    }
  }, [loading, info.next, page, nameFilter, episodeFilter]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  function selectSeason(season: number | null) {
    play();
    const params = new URLSearchParams(searchParams.toString());
    if (season === null) {
      params.delete("season");
    } else {
      params.set("season", String(season));
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    if (season !== null) {
      rowRefs.current
        .get(season)
        ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  const seasonGroups = groupBySeason(episodes);
  const seasons = seasonGroups.map(([s]) => s);
  const visibleGroups =
    activeSeason === null
      ? seasonGroups
      : seasonGroups.filter(([s]) => s === activeSeason);

  return (
    <div>
      <div className={styles.seasonNav}>
        <button
          onClick={() => selectSeason(null)}
          className={`${styles.seasonBtn} ${activeSeason === null ? styles.seasonBtnActive : ""}`}
        >
          All
        </button>
        {seasons.map((s) => (
          <button
            key={s}
            onClick={() => selectSeason(s)}
            className={`${styles.seasonBtn} ${s === activeSeason ? styles.seasonBtnActive : ""}`}
          >
            Season {s}
          </button>
        ))}
      </div>

      {visibleGroups.map(([season, eps]) => (
        <section
          key={season}
          ref={(el) => {
            if (el) rowRefs.current.set(season, el);
          }}
          className={styles.seasonSection}
        >
          <h2 className={styles.seasonHeading}>Season {season}</h2>

          <ScrollRow>
            {eps.map((ep) => (
              <EpisodeCard key={ep.id} episode={ep} />
            ))}
          </ScrollRow>
        </section>
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className={styles.sentinel}>
        {loading && <span className={styles.loadingSpinner} />}
      </div>
    </div>
  );
}

function ScrollRow({ children }: { children: React.ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [fadeLeft, setFadeLeft] = useState(false);
  const [fadeRight, setFadeRight] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setFadeLeft(scrollLeft > 0);
      setFadeRight(scrollLeft + clientWidth < scrollWidth - 1);
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className={styles.scrollRowWrapper}>
      <div
        className={`${styles.fadeLeft} ${fadeLeft ? styles.fadeVisible : ""}`}
      />
      <div
        className={`${styles.fadeRight} ${fadeRight ? styles.fadeVisible : ""}`}
      />
      <div ref={rowRef} className={styles.scrollRow}>
        {children}
      </div>
    </div>
  );
}

function EpisodeCard({ episode }: { episode: Episode }) {
  const epNum = episode.episode.match(/E(\d+)$/)?.[1] ?? "";
  return (
    <Link href={`/episodes/${episode.id}`} className={styles.card}>
      <div className={styles.cardCode}>{episode.episode}</div>
      <div className={styles.cardBody}>
        <p className={styles.cardEpNum}>Episode {parseInt(epNum, 10)}</p>
        <h3 className={styles.cardTitle}>{episode.name}</h3>
        <p className={styles.cardDate}>{episode.air_date}</p>
      </div>
    </Link>
  );
}
