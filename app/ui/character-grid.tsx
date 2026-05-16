"use client";

import { CharacterCard } from "./character-card";
import styles from "./character-grid.module.css";
import { Character } from "@/lib/api/rickMorty/rickMorty.types";
import { CharacterModal } from "./character-modal";
import { useCallback, useState } from "react";

export function CharacterGrid({ characters }: { characters: Character[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = useCallback(
    (character: Character) => {
      setSelectedIndex(characters.findIndex((c) => c.id === character.id));
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

  const selected = selectedIndex !== null ? characters[selectedIndex] : null;

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

      {selected && selectedIndex !== null && (
        <CharacterModal
          character={selected}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}
