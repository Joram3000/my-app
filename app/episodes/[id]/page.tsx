import Link from "next/link";
import { notFound } from "next/navigation";
import { type Metadata } from "next";

import styles from "./page.module.css";
import shared from "@/ui/detail-page.module.css";
import {
  API_PAGE_SIZE,
  fetchCharactersByUrls,
  fetchEpisode,
} from "@/lib/api/rickMorty/rickMorty";
import { CharacterGrid } from "@/ui/character-grid";
import { InfoCard } from "@/ui/info-card";
import { Backlink } from "@/ui/backlink";

export const metadata: Metadata = { title: "Rick & Morty - Episode" };

type Params = Promise<{ id: string }>;

export default async function EpisodePage({ params }: { params: Params }) {
  const { id } = await params;
  const episode = await fetchEpisode(Number(id));
  if (!episode) notFound();

  const characters = await fetchCharactersByUrls(
    episode.characters.slice(0, API_PAGE_SIZE),
  );

  return (
    <div className={shared.container}>
      <Backlink label={"Back to episodes"} href={"/episodes"} />

      <div className={shared.card}>
        <div className={styles.cardHeader}>
          <div className={styles.episodeBadge}>{episode.episode}</div>
          <div>
            <h1 className={styles.episodeName}>{episode.name}</h1>
            <p className={styles.episodeDate}>{episode.air_date}</p>
          </div>
        </div>

        <dl className={`${shared.infoGrid} ${shared.infoGrid3col}`}>
          <InfoCard label="Episode" value={episode.episode} />
          <InfoCard label="Air date" value={episode.air_date} />
          <InfoCard
            label="Characters"
            value={String(episode.characters.length)}
          />
        </dl>
      </div>

      {characters.length > 0 && (
        <section className={shared.section}>
          <h2 className={shared.sectionHeading}>
            Characters in this episode
            {episode.characters.length > 20 && (
              <span className={styles.sectionNote}>
                (showing first 20 of {episode.characters.length})
              </span>
            )}
          </h2>
          <CharacterGrid characters={characters} minColWidth={200} />
        </section>
      )}
    </div>
  );
}
