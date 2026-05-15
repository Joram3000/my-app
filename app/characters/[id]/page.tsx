import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { type Metadata } from "next";
import styles from "./page.module.css";
import { fetchCharacter } from "@/lib/api/rickMorty/rickMorty";

export const metadata: Metadata = { title: "Character" };

type Params = Promise<{ id: string }>;

export default function CharacterPage({ params }: { params: Params }) {
  return (
    <div className={styles.container}>
      <Link href="/characters" className={styles.backLink}>
        ← Back to characters
      </Link>
      <Suspense fallback={null}>
        <CharacterDetail params={params} />
      </Suspense>
    </div>
  );
}

async function CharacterDetail({ params }: { params: Params }) {
  const { id } = await params;
  const character = await fetchCharacter(Number(id));

  if (!character) notFound();

  const episodeNumbers = character.episode.map((url) =>
    parseInt(url.split("/").pop()!),
  );

  return (
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
            <p className={styles.status}>({character.status})</p>
          </div>

          <dl className={styles.infoGrid}>
            <InfoCard label="Species" value={character.species} />
            {character.type && <InfoCard label="Type" value={character.type} />}
            <InfoCard label="Gender" value={character.gender} />
            <InfoCard label="Origin" value={character.origin.name} />
            <InfoCard
              label="Last known location"
              value={character.location.name}
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
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoCard}>
      <dt className={styles.infoLabel}>{label}</dt>
      <dd className={styles.infoValue}>{value}</dd>
    </div>
  );
}
