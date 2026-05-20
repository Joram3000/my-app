"use client";

import { CharacterCard } from "./character-card";
import { TiltGrid } from "./tilt-grid";
import {
  Character,
  CharacterFilters,
} from "@/lib/api/rickMorty/rickMorty.types";
import { CharacterModal } from "./character-modal";
import { useCallback, useState } from "react";
import { useSam } from "@/hooks/use-sam";
import {
  fetchCharacters,
  fetchCharactersByUrls,
  API_PAGE_SIZE,
} from "@/lib/api/rickMorty/rickMorty";

interface CharacterGridProps {
  characters: Character[];
  minColWidth?: number;
  windowStart?: number;
  totalCount?: number;
  filters?: CharacterFilters;
  residentUrls?: string[];
}

export function CharacterGrid({
  characters,
  minColWidth = 240,
  windowStart = 0,
  totalCount,
  filters,
  residentUrls,
}: CharacterGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { speak } = useSam({ speed: 80 });

  const fetchPage = useCallback(
    async (page: number) => {
      if (residentUrls) {
        const start = (page - 1) * API_PAGE_SIZE;
        return fetchCharactersByUrls(
          residentUrls.slice(start, start + API_PAGE_SIZE),
        );
      }
      const data = await fetchCharacters(page, filters ?? {});
      return data.results;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      residentUrls,
      filters?.name,
      filters?.status,
      filters?.species,
      filters?.gender,
    ],
  );

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
          windowStart={windowStart}
          totalCount={totalCount}
          onFetchMore={fetchPage}
        />
      )}
    </>
  );
}
