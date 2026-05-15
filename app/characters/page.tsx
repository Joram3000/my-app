import { Suspense } from "react";
import { type Metadata } from "next";

import { fetchCharacters } from "@/lib/api/rickMorty/rickMorty";
import { CharacterGrid } from "@/ui/character-grid";
import styles from "./page.module.css";

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

      <Suspense fallback={<p>...loading</p>}>
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

  const data = await fetchCharacters(currentPage);

  return (
    <>
      <p className={styles.count}>
        {data.info.count > 0
          ? `${data.info.count} characters found`
          : "No characters found"}
      </p>
      <CharacterGrid characters={data.results} />
    </>
  );
}
