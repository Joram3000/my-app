import { Suspense } from "react";
import { notFound } from "next/navigation";
import { type Metadata } from "next";

import styles from "./page.module.css";
import shared from "@/ui/detail-page.module.css";
import {
  API_PAGE_SIZE,
  fetchCharactersByUrls,
  fetchLocation,
} from "@/lib/api/rickMorty/rickMorty";
import { CharacterGrid } from "@/ui/character-grid";
import { InfoCard } from "@/ui/info-card";
import { CharacterGridSkeleton } from "@/ui/skeletons";
import { Pagination } from "@/ui/pagination";
import { Backlink } from "@/ui/backlink";

export const metadata: Metadata = { title: "Rick & Morty - Location" };


type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ page?: string }>;

export default async function LocationPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const location = await fetchLocation(Number(id));
  if (!location) notFound();

  const totalResidents = location.residents.length;

  return (
    <div className={shared.container}>
      <Backlink label={"Back to locations"} href={"/locations"} />

      <div className={shared.card}>
        <div className={styles.cardHeader}>
          <div>
            <h1 className={styles.locationName}>{location.name}</h1>
            <p className={styles.locationResidents}>
              {totalResidents} known resident{totalResidents !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <dl className={`${shared.infoGrid} ${shared.infoGrid3col}`}>
          <InfoCard label="Type" value={location.type || "—"} />
          <InfoCard label="Dimension" value={location.dimension || "—"} />
          <InfoCard label="Residents" value={String(totalResidents)} />
        </dl>
      </div>

      {totalResidents > 0 && (
        <section className={shared.section}>
          <h2 className={shared.sectionHeading}>Residents</h2>
          <Suspense fallback={<CharacterGridSkeleton />}>
            <LocationResidents
              residents={location.residents}
              locationId={id}
              searchParams={searchParams}
            />
          </Suspense>
        </section>
      )}
    </div>
  );
}

async function LocationResidents({
  residents,
  locationId,
  searchParams,
}: {
  residents: string[];
  locationId: string;
  searchParams: SearchParams;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);
  const totalResidents = residents.length;
  const totalPages = Math.ceil(totalResidents / API_PAGE_SIZE);
  const start = (currentPage - 1) * API_PAGE_SIZE;

  const characters = await fetchCharactersByUrls(
    residents.slice(start, start + API_PAGE_SIZE),
  );

  const info = {
    count: totalResidents,
    pages: totalPages,
    next: currentPage < totalPages ? String(currentPage + 1) : null,
    prev: currentPage > 1 ? String(currentPage - 1) : null,
  };

  return (
    <>
      <CharacterGrid
        characters={characters}
        minColWidth={215}
        windowStart={start}
        totalCount={totalResidents}
        residentUrls={residents}
      />
      <Pagination
        info={info}
        currentPage={currentPage}
        basePath={`/locations/${locationId}`}
      />
    </>
  );
}
