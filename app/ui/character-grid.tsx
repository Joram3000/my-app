"use client";

import { CharacterCard } from "./character-card";
import { TiltGrid } from "./tilt-grid";
import styles from "./character-grid.module.css";
import { Character, ApiInfo, CharacterFilters } from "@/lib/api/rickMorty/rickMorty.types";
import { BASE_URL } from "@/lib/api/rickMorty/rickMorty";
import { CharacterModal } from "./character-modal";
import { useCallback, useEffect, useRef, useState } from "react";

interface CharacterGridProps {
  characters: Character[];
  info?: ApiInfo;
  currentPage?: number;
  filters?: CharacterFilters;
}

export function CharacterGrid({ characters, info, currentPage, filters }: CharacterGridProps) {
  const [allCharacters, setAllCharacters] = useState(characters);
  const [nextPage, setNextPage] = useState<number | null>(() =>
    info?.next ? currentPage! + 1 : null
  );
  const [prevPage, setPrevPage] = useState<number | null>(() =>
    info?.prev ? currentPage! - 1 : null
  );
  const [isLoadingNext, setIsLoadingNext] = useState(false);
  const [isLoadingPrev, setIsLoadingPrev] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const loadingNextRef = useRef(false);
  const loadingPrevRef = useRef(false);

  useEffect(() => {
    setAllCharacters(characters);
    setNextPage(info?.next ? currentPage! + 1 : null);
    setPrevPage(info?.prev ? currentPage! - 1 : null);
  }, [characters, info, currentPage]);

  const handleSelect = useCallback(
    (character: Character) => {
      setSelectedIndex(allCharacters.findIndex((c) => c.id === character.id));
    },
    [allCharacters],
  );

  const fetchPage = useCallback(async (page: number) => {
    if (!filters) return null;
    const params = new URLSearchParams({ page: String(page) });
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    const res = await fetch(`${BASE_URL}/character?${params}`);
    if (!res.ok) return null;
    return res.json();
  }, [filters]);

  const nextPageRef = useRef(nextPage);
  const prevPageRef = useRef(prevPage);
  useEffect(() => { nextPageRef.current = nextPage; }, [nextPage]);
  useEffect(() => { prevPageRef.current = prevPage; }, [prevPage]);

  const loadNext = useCallback(async () => {
    if (loadingNextRef.current || nextPageRef.current === null) return;
    loadingNextRef.current = true;
    setIsLoadingNext(true);
    const page = nextPageRef.current;
    try {
      const data = await fetchPage(page);
      if (!data) return;
      setAllCharacters((prev) => [...prev, ...data.results]);
      const newNext = data.info.next ? page + 1 : null;
      setNextPage(newNext);
      nextPageRef.current = newNext;
    } finally {
      loadingNextRef.current = false;
      setIsLoadingNext(false);
    }
  }, [fetchPage]);

  const loadPrev = useCallback(async () => {
    if (loadingPrevRef.current || prevPageRef.current === null) return;
    loadingPrevRef.current = true;
    setIsLoadingPrev(true);
    const page = prevPageRef.current;
    try {
      const data = await fetchPage(page);
      if (!data) return;
      const prepended = data.results as Character[];
      setAllCharacters((prev) => [...prepended, ...prev]);
      setSelectedIndex((i) => (i !== null ? i + prepended.length : i));
      const newPrev = data.info.prev ? page - 1 : null;
      setPrevPage(newPrev);
      prevPageRef.current = newPrev;
    } finally {
      loadingPrevRef.current = false;
      setIsLoadingPrev(false);
    }
  }, [fetchPage]);

  const allCharactersLengthRef = useRef(allCharacters.length);
  useEffect(() => { allCharactersLengthRef.current = allCharacters.length; }, [allCharacters.length]);

  const handleModalIndexChange = useCallback((index: number) => {
    setSelectedIndex(index);
    if (index >= allCharactersLengthRef.current - 5) loadNext();
    if (index <= 4) loadPrev();
  }, [loadNext, loadPrev]);

  if (characters.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>No characters found.</p>
      </div>
    );
  }

  return (
    <>
      <TiltGrid minColWidth={240}>
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
          characters={allCharacters}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onIndexChange={handleModalIndexChange}
          isLoadingNext={isLoadingNext}
          isLoadingPrev={isLoadingPrev}
        />
      )}
    </>
  );
}
