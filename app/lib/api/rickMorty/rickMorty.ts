import type { Character, PaginatedResponse } from "./rickMorty.types";

const BASE_URL = "https://rickandmortyapi.com/api";

export async function fetchCharacters(
  page = 1,
): Promise<PaginatedResponse<Character>> {
  const res = await fetch(`${BASE_URL}/character?page=${page}`);

  if (!res.ok) {
    throw new Error("Failed to fetch characters");
  }

  return res.json() as Promise<PaginatedResponse<Character>>;
}

export async function fetchCharacter(id: number): Promise<Character | null> {
  const res = await fetch(`${BASE_URL}/character/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}
