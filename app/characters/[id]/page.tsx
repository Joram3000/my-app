import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import styles from "./page.module.css";
import shared from "@/ui/detail-page.module.css";
import { fetchCharacter } from "@/lib/api/rickMorty/rickMorty";
import { InfoCard } from "@/ui/info-card";
import { Backlink } from "@/ui/backlink";

export const metadata: Metadata = { title: "Rick & Morty - Character" };

type Params = Promise<{ id: string }>;

export default async function CharacterPage({ params }: { params: Params }) {
  const { id } = await params;
  const character = await fetchCharacter(Number(id));

  if (!character) notFound();

  const episodeNumbers = character.episode.map((url) =>
    parseInt(url.split("/").pop()!),
  );

  return (
    <div className={shared.container}>
      <Backlink label={"Back to characters"} href={"/characters"} />

      <div className={styles.card}>
        <div className={styles.cardInner}>
          <div className={styles.imageWrapper}>
            <Image
              src={character.image}
              alt={character.name}
              fill
              priority
              className={styles.image}
            />
          </div>

          <div className={styles.infoSection}>
            <div className={styles.nameStatusWrapper}>
              <h1 className={styles.name}>{character.name}</h1>
            </div>

            <dl className={`${shared.infoGrid} ${shared.infoGrid2col}`}>
              <InfoCard label="Status" value={character.status} />
              <InfoCard
                label="Species"
                value={character.species}
                href={`/characters?species=${encodeURIComponent(character.species)}`}
              />
              {character.type && (
                <InfoCard label="Type" value={character.type} />
              )}
              <InfoCard
                label="Gender"
                value={character.gender}
                href={`/characters?gender=${encodeURIComponent(character.gender)}`}
              />
              <InfoCard
                label="Origin"
                value={character.origin.name}
                href={
                  character.origin.url
                    ? `/locations/${character.origin.url.split("/").pop()}`
                    : undefined
                }
              />
              <InfoCard
                label="Last known location"
                value={character.location.name}
                href={
                  character.location.url
                    ? `/locations/${character.location.url.split("/").pop()}`
                    : undefined
                }
              />
              <InfoCard
                label="Episodes"
                value={String(character.episode.length)}
              />
            </dl>
          </div>
        </div>

        <div className={styles.episodesSection}>
          <h2 className={styles.episodesHeading}>Episodes</h2>
          <div className={styles.episodesWrapper}>
            {episodeNumbers.map((num) => (
              <Link
                key={num}
                href={`/episodes/${num}`}
                className={styles.episodeLink}
              >
                Episode {num}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
