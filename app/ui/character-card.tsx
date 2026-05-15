"use client";

import Image from "next/image";
import styles from "./character-card.module.css";
import { Character } from "@/lib/api/rickMorty/rickMorty.types";

interface CharacterCardProps {
  character: Character;
  onClick: (character: Character) => void;
}

export function CharacterCard({ character, onClick }: CharacterCardProps) {
  return (
    <button
      onClick={() => onClick(character)}
      className={styles.card}
      aria-label={`View ${character.name}`}
    >
      <div className={styles.imageWrapper}>
        <Image
          src={character.image}
          alt={character.name}
          width={300}
          height={300}
          className={styles.image}
        />
        <div className={styles.gradient} />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{character.name}</h3>
        <div className={styles.meta}>
          <span className={styles.species}>{character.species}</span>
        </div>
      </div>
    </button>
  );
}
