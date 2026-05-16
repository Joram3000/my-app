import type {
  ApiResponse,
  Character,
  Location,
  Episode,
} from "./rickMorty.types";

export const BASE_URL = "https://rickandmortyapi.com/api";

export async function fetchCharacters(
  page = 1,
): Promise<ApiResponse<Character>> {
  const res = await fetch(`${BASE_URL}/character?page=${page}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch characters");
  }

  return res.json() as Promise<ApiResponse<Character>>;
}

export async function fetchCharactersByUrls(
  urls: string[],
): Promise<Character[]> {
  if (urls.length === 0) return [];
  const ids = urls.map((url) => url.split("/").pop()).join(",");
  const res = await fetch(`${BASE_URL}/character/${ids}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}

export async function fetchCharacter(id: number): Promise<Character | null> {
  const res = await fetch(`${BASE_URL}/character/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchLocations(page = 1): Promise<ApiResponse<Location>> {
  const params = new URLSearchParams({ page: String(page) });
  const res = await fetch(`${BASE_URL}/location?${params}`, {
    next: { revalidate: 3600 },
  });
  if (res.status === 404) return EMPTY_RESPONSE<Location>();
  if (!res.ok) throw new Error("Failed to fetch locations");
  return res.json();
}

export async function fetchLocation(id: number): Promise<Location | null> {
  const res = await fetch(`${BASE_URL}/location/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function fetchEpisodes(page = 1): Promise<ApiResponse<Episode>> {
  const params = new URLSearchParams({ page: String(page) });
  const res = await fetch(`${BASE_URL}/episode?${params}`, {
    next: { revalidate: 3600 },
  });
  if (res.status === 404) return EMPTY_RESPONSE<Episode>();
  if (!res.ok) throw new Error("Failed to fetch episodes");
  return res.json();
}

export async function fetchEpisode(id: number): Promise<Episode | null> {
  const res = await fetch(`${BASE_URL}/episode/${id}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

const EMPTY_RESPONSE = <T>(): ApiResponse<T> => ({
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
});
