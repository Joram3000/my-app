"use client";

import { CharacterCard } from "./character-card";
import styles from "./character-grid.module.css";
import { Character } from "@/lib/api/rickMorty/rickMorty.types";
import Link from "next/link";

export function CharacterGrid({ characters }: { characters: Character[] }) {
  if (characters.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>No characters found.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {characters.map((char) => (
          <Link
            href={`/characters/${char.id}`}
            key={char.id}
            className={styles.link}
          >
            <CharacterCard
              key={char.id}
              character={char}
              onClick={() => {
                // open modal with character details
              }}
            />
          </Link>
        ))}
      </div>
    </>
  );
}
