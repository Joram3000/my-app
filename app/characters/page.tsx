import { Suspense } from "react";
import { type Metadata } from "next";

import { fetchCharacters } from "@/lib/api/rickMorty/rickMorty";
import { CharacterGrid } from "@/ui/character-grid";
import { Pagination } from "@/ui/pagination";
import { FilterBar } from "@/ui/filter-bar";
import { CHARACTER_FILTERS } from "@/lib/api/rickMorty/filters";
import {
  CharacterGridSkeleton,
  CountSkeleton,
  FilterBarSkeleton,
} from "@/ui/skeletons";

export const metadata: Metadata = { title: "Rick & Morty - Characters" };

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
    <div className="pageContainer">
      <h1 className="pageHeading">Characters</h1>
      <Suspense fallback={<FilterBarSkeleton filters={CHARACTER_FILTERS} />}>
        <FilterBar filters={CHARACTER_FILTERS} />
      </Suspense>
      <Suspense
        fallback={
          <>
            <CountSkeleton />
            <CharacterGridSkeleton />
          </>
        }
      >
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
      <p className="pageCount">
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
