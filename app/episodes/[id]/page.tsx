import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { type Metadata } from "next";

import styles from "./page.module.css";
import { fetchCharactersByUrls, fetchEpisode } from "@/lib/api/rickMorty/rickMorty";
import { CharacterGrid } from "@/ui/character-grid";
import { InfoCard } from "@/ui/info-card";
import { EpisodeDetailSkeleton } from "@/ui/skeletons";
import { BiLeftArrowAlt } from "react-icons/bi";

export const metadata: Metadata = { title: "Episode" };

type Params = Promise<{ id: string }>;

export default function EpisodePage({ params }: { params: Params }) {
  return (
    <div className={styles.container}>
      <Link href="/episodes" className={styles.backLink}>
        <BiLeftArrowAlt /> Back to episodes
      </Link>
      <Suspense fallback={<EpisodeDetailSkeleton />}>
        <EpisodeDetail params={params} />
      </Suspense>
    </div>
  );
}

async function EpisodeDetail({ params }: { params: Params }) {
  const { id } = await params;
  const episode = await fetchEpisode(Number(id));
  if (!episode) notFound();

  const characters = await fetchCharactersByUrls(episode.characters.slice(0, 20));

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.episodeBadge}>{episode.episode}</div>
          <div>
            <h1 className={styles.episodeName}>{episode.name}</h1>
            <p className={styles.episodeDate}>{episode.air_date}</p>
          </div>
        </div>

        <dl className={styles.infoGrid}>
          <InfoCard label="Episode" value={episode.episode} />
          <InfoCard label="Air date" value={episode.air_date} />
          <InfoCard label="Characters" value={String(episode.characters.length)} />
        </dl>
      </div>

      {characters.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            Characters in this episode
            {episode.characters.length > 20 && (
              <span className={styles.sectionNote}>
                (showing first 20 of {episode.characters.length})
              </span>
            )}
          </h2>
          <CharacterGrid characters={characters} />
        </section>
      )}
    </>
  );
}
