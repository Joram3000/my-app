"use client";

import { CharacterCard } from "./character-card";
import { TiltGrid } from "./tilt-grid";
import { Character } from "@/lib/api/rickMorty/rickMorty.types";
import { CharacterModal } from "./character-modal";
import { useCallback, useState } from "react";
import { useSam } from "@/hooks/use-sam";

interface CharacterGridProps {
  characters: Character[];
  minColWidth?: number;
}

export function CharacterGrid({
  characters,
  minColWidth = 240,
}: CharacterGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { speak } = useSam({ speed: 80 });

  const handleSelect = useCallback(
    (character: Character) => {
      speak(character.name);
      setSelectedIndex(characters.findIndex((c) => c.id === character.id));
    },
    [characters, speak],
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
