import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { BiLeftArrowAlt } from "react-icons/bi";

import styles from "./page.module.css";
import shared from "@/ui/detail-page.module.css";
import {
  fetchCharactersByUrls,
  fetchLocation,
} from "@/lib/api/rickMorty/rickMorty";
import { CharacterGrid } from "@/ui/character-grid";
import { InfoCard } from "@/ui/info-card";
import { CharacterGridSkeleton } from "@/ui/skeletons";
import { Pagination } from "@/ui/pagination";

export const metadata: Metadata = { title: "Rick & Morty - Location" };

const PAGE_SIZE = 20;

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
      <Link href="/locations" className={shared.backLink}>
        <BiLeftArrowAlt /> Back to locations
      </Link>

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
  const totalPages = Math.ceil(totalResidents / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;

  const characters = await fetchCharactersByUrls(
    residents.slice(start, start + PAGE_SIZE),
  );

  const info = {
    count: totalResidents,
    pages: totalPages,
    next: currentPage < totalPages ? String(currentPage + 1) : null,
    prev: currentPage > 1 ? String(currentPage - 1) : null,
  };

  return (
    <>
      <CharacterGrid characters={characters} minColWidth={105} />
      <Pagination
        info={info}
        currentPage={currentPage}
        basePath={`/locations/${locationId}`}
      />
    </>
  );
}
