import { type Metadata } from "next";

import { fetchCharacters } from "@/lib/api/rickMorty/rickMorty";
import { CharacterGrid } from "@/ui/character-grid";
import styles from "./page.module.css";
import { Pagination } from "@/ui/pagination";
import { FilterBar } from "@/ui/filter-bar";
import { CHARACTER_FILTERS } from "@/lib/filters";

export const metadata: Metadata = { title: "Characters" };

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
      <FilterBar filters={CHARACTER_FILTERS} />
      <CharactersContent searchParams={searchParams} />
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
