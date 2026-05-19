"use client";

import { CharacterCard } from "./character-card";
import { TiltGrid } from "./tilt-grid";
import { Character } from "@/lib/api/rickMorty/rickMorty.types";
import { CharacterModal } from "./character-modal";
import { useCallback, useState } from "react";
import { useSound } from "@/hooks/use-sound";

interface CharacterGridProps {
  characters: Character[];
  minColWidth?: number;
}

export function CharacterGrid({
  characters,
  minColWidth = 240,
}: CharacterGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { play } = useSound();

  const handleSelect = useCallback(
    (character: Character) => {
      play();
      setSelectedIndex(characters.findIndex((c) => c.id === character.id));
    },
    [characters, play],
  );

  if (characters.length === 0) {
    return (
      <div className="emptyState">
        <p className="emptyStateText">No characters found.</p>
      </div>
    );
  }

  return (
    <>
      <TiltGrid minColWidth={minColWidth}>
        {characters.map((char) => (
          <CharacterCard
            key={char.id}
            character={char}
            onClick={handleSelect}
          />
        ))}
      </TiltGrid>

      {selectedIndex !== null && (
        <CharacterModal
          characters={characters}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}
