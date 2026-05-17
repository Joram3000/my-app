import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { type Metadata } from "next";
import { BiLeftArrowAlt } from "react-icons/bi";
import styles from "./page.module.css";
import {
  fetchCharactersByUrls,
  fetchLocation,
} from "@/lib/api/rickMorty/rickMorty";
import { CharacterGrid } from "@/ui/character-grid";
import { InfoCard } from "@/ui/info-card";
import { DetailHeaderSkeleton, InfoGridSkeleton } from "@/ui/skeletons";
import { Pagination } from "@/ui/pagination";

export const metadata: Metadata = { title: "Location" };

const PAGE_SIZE = 20;

type Params = Promise<{ id: string }>;
type SearchParams = Promise<{ page?: string }>;

function LocationDetailSkeleton() {
  return (
    <div className={styles.card}>
      <DetailHeaderSkeleton badge={false} />
      <div className={styles.infoGrid}>
        <InfoGridSkeleton count={3} />
      </div>
    </div>
  );
}

export default function LocationPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  return (
    <div className={styles.container}>
      <Link href="/locations" className={styles.backLink}>
        <BiLeftArrowAlt /> Back to locations
      </Link>
      <Suspense fallback={<LocationDetailSkeleton />}>
        <LocationDetail params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function LocationDetail({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const location = await fetchLocation(Number(id));
  if (!location) notFound();

  const totalResidents = location.residents.length;
  const totalPages = Math.ceil(totalResidents / PAGE_SIZE);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const residents = await fetchCharactersByUrls(
    location.residents.slice(start, end),
  );

  const info = {
    count: totalResidents,
    pages: totalPages,
    next: currentPage < totalPages ? String(currentPage + 1) : null,
    prev: currentPage > 1 ? String(currentPage - 1) : null,
  };

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h1 className={styles.locationName}>{location.name}</h1>
            <p className={styles.locationResidents}>
              {totalResidents} known resident
              {totalResidents !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <dl className={styles.infoGrid}>
          <InfoCard label="Type" value={location.type || "—"} />
          <InfoCard label="Dimension" value={location.dimension || "—"} />
          <InfoCard label="Residents" value={String(totalResidents)} />
        </dl>
      </div>

      {residents.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Residents</h2>
          <CharacterGrid characters={residents} />

          <Pagination
            info={info}
            currentPage={currentPage}
            basePath={`/locations/${id}`}
          />
        </section>
      )}
    </>
  );
}
