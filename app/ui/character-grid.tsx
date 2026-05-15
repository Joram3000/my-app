"use client";

import { useCallback, useState } from "react";
import { CharacterCard } from "./character-card";
import styles from "./character-grid.module.css";
import { Character } from "@/lib/api/rickMorty/rickMorty.types";

export function CharacterGrid({ characters }: { characters: Character[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = useCallback(
    (character: Character) => {
      setSelectedIndex(characters.findIndex((c) => c.id === character.id));
      console.log("handleSelect called with character:", character);
    },
    [characters],
  );

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
          <CharacterCard
            key={char.id}
            character={char}
            onClick={handleSelect}
          />
        ))}
      </div>
    </>
  );
}
