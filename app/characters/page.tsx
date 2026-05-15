import { fetchCharacters } from "@/lib/api/rickMorty/rickMorty";
import { Character } from "@/lib/api/rickMorty/rickMorty.types";
import { CharacterCard } from "@/ui/character-card";
import { type Metadata } from "next";
import styles from "./page.module.css";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Characters" };

export default function CharactersPage() {
  return (
    <>
      <h1>Characters</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <CharactersGrid />
      </Suspense>
    </>
  );
}

async function CharactersGrid() {
  const data = await fetchCharacters(1);

  return (
    <div className={styles.grid}>
      {data.results.map((character: Character) => (
        <CharacterCard key={character.id} character={character} />
      ))}
    </div>
  );
}
