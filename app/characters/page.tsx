import { Suspense } from "react";
import { type Metadata } from "next";

import { fetchCharacters } from "@/lib/api/rickMorty/rickMorty";
import { CharacterGrid } from "@/ui/character-grid";
import { CharacterGridSkeleton } from "@/ui/skeletons";
import styles from "./page.module.css";
import { Pagination } from "@/ui/pagination";
import { FilterBar } from "@/ui/filter-bar";

export const metadata: Metadata = { title: "Characters" };

const CHARACTER_FILTERS = [
  { type: "text" as const, key: "name", placeholder: "Search by name…" },
  {
    type: "select" as const,
    key: "status",
    label: "Status",
    options: ["Alive", "Dead", "unknown"],
  },
  { type: "text" as const, key: "species", placeholder: "Species…" },
  {
    type: "select" as const,
    key: "gender",
    label: "Gender",
    options: ["Female", "Male", "Genderless", "unknown"],
  },
];

type SearchParams = Promise<{
  page?: string;
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
}>;

export default function CharactersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Characters</h1>
      <Suspense>
        <FilterBar filters={CHARACTER_FILTERS} />
      </Suspense>
      <Suspense fallback={<CharacterGridSkeleton />}>
        <CharactersContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CharactersContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1") || 1);
  const filters = {
    name: params.name,
    status: params.status,
    species: params.species,
    gender: params.gender,
  };

  const data = await fetchCharacters(currentPage, filters);

  return (
    <>
      <p className={styles.count}>
        {data.info.count > 0
          ? `${data.info.count} characters found`
          : "No characters found"}
      </p>
      <CharacterGrid
        characters={data.results}
        info={data.info}
        currentPage={currentPage}
        filters={filters}
      />
      <Pagination
        info={data.info}
        currentPage={currentPage}
        basePath="/characters"
      />
    </>
  );
}
