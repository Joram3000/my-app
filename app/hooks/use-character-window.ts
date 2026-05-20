"use client";

import { useState, useEffect, useRef } from "react";
import { Character } from "@/lib/api/rickMorty/rickMorty.types";
import { API_PAGE_SIZE } from "@/lib/api/rickMorty/rickMorty";

const PREFETCH_THRESHOLD = 3;

export function useCharacterWindow(
  initialItems: Character[],
  initialIndex: number,
  initialWindowStart: number,
  totalCount: number,
  fetchPage: (page: number) => Promise<Character[]>,
) {
  const [items, setItems] = useState(initialItems);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [windowStart, setWindowStart] = useState(initialWindowStart);
  const fetching = useRef(new Set<number>());

  // Prefetch next API page when approaching the end
  useEffect(() => {
    const absoluteWindowEnd = windowStart + items.length;
    if (absoluteWindowEnd >= totalCount) return;
    if (items.length - 1 - currentIndex > PREFETCH_THRESHOLD) return;

    const nextApiPage = Math.floor(absoluteWindowEnd / API_PAGE_SIZE) + 1;
    if (fetching.current.has(nextApiPage)) return;
    fetching.current.add(nextApiPage);

    const apiPageStart = (nextApiPage - 1) * API_PAGE_SIZE;
    fetchPage(nextApiPage)
      .then((results) => {
        fetching.current.delete(nextApiPage);
        const fresh = results.filter((_, i) => apiPageStart + i >= absoluteWindowEnd);
        if (fresh.length > 0) setItems((prev) => [...prev, ...fresh]);
      })
      .catch(() => {
        fetching.current.delete(nextApiPage);
      });
  }, [currentIndex, items.length, windowStart, totalCount, fetchPage]);

  // Prefetch previous API page when approaching the start
  useEffect(() => {
    if (windowStart <= 0) return;
    if (currentIndex > PREFETCH_THRESHOLD) return;

    const prevApiPage = Math.floor((windowStart - 1) / API_PAGE_SIZE) + 1;
    if (fetching.current.has(prevApiPage)) return;
    fetching.current.add(prevApiPage);

    const apiPageStart = (prevApiPage - 1) * API_PAGE_SIZE;
    fetchPage(prevApiPage)
      .then((results) => {
        fetching.current.delete(prevApiPage);
        // only prepend items that come before the current window
        const fresh = results.filter((_, i) => apiPageStart + i < windowStart);
        if (fresh.length === 0) return;
        setItems((prev) => [...fresh, ...prev]);
        setWindowStart((ws) => ws - fresh.length);
        // shift currentIndex so the same character stays selected
        setCurrentIndex((ci) => ci + fresh.length);
      })
      .catch(() => {
        fetching.current.delete(prevApiPage);
      });
  }, [currentIndex, windowStart, fetchPage]);

  return {
    items,
    currentIndex,
    setCurrentIndex,
    windowStart,
    hasNext: windowStart + currentIndex < totalCount - 1,
    hasPrev: windowStart + currentIndex > 0,
  };
}
