import { Suspense } from "react";
import Link from "next/link";
import { type Metadata } from "next";

import styles from "./page.module.css";
import { fetchLocations } from "@/lib/api/rickMorty/rickMorty";
import { Pagination } from "@/ui/pagination";
import { BiRightArrowAlt } from "react-icons/bi";
import { FilterBar } from "@/ui/filter-bar";
import { LOCATION_FILTERS } from "@/lib/filters";
import { CountSkeleton, LocationGridSkeleton } from "@/ui/skeletons";

export const metadata: Metadata = { title: "Locations" };

type SearchParams = Promise<{
  page?: string;
  name?: string;
  type?: string;
  dimension?: string;
}>;

export default function LocationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Locations</h1>
      <FilterBar filters={LOCATION_FILTERS} />
      <Suspense fallback={<><CountSkeleton /><LocationGridSkeleton /></>}>
        <LocationsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function LocationsContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page ?? "1") || 1);

  const data = await fetchLocations(currentPage, {
    name: params.name,
    type: params.type,
    dimension: params.dimension,
  });

  return (
    <>
      <p className={styles.count}>
        {data.info.count > 0
          ? `${data.info.count} locations found`
          : "No locations found"}
      </p>

      {data.results.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>No locations found.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {data.results.map((loc) => (
            <Link
              key={loc.id}
              href={`/locations/${loc.id}`}
              className={styles.locationCard}
            >
              <div className={styles.locationCardHeader}>
                <h3 className={styles.locationName}>{loc.name}</h3>
                <span className={styles.locationArrow}>
                  <BiRightArrowAlt />
                </span>
              </div>
              <div className={styles.tagList}>
                <Tag label="Type" value={loc.type || "unknown"} />
                <Tag label="Dimension" value={loc.dimension || "unknown"} />
                <Tag label="Residents" value={String(loc.residents.length)} />
              </div>
            </Link>
          ))}
        </div>
      )}

      <Pagination
        info={data.info}
        currentPage={currentPage}
        basePath="/locations"
      />
    </>
  );
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <p className={styles.tag}>
      <span className={styles.tagLabel}>{label}</span>
      <span className={styles.tagValue}>{value}</span>
    </p>
  );
}
