import { Suspense } from "react";
import { type Metadata } from "next";

import { fetchLocations } from "@/lib/api/rickMorty/rickMorty";
import { Pagination } from "@/ui/pagination";
import { FilterBar } from "@/ui/filter-bar";
import { LOCATION_FILTERS } from "@/lib/api/rickMorty/filters";
import {
  CountSkeleton,
  LocationGridSkeleton,
  FilterBarSkeleton,
} from "@/ui/skeletons";
import { TiltGrid } from "@/ui/tilt-grid";
import { LocationCard } from "@/ui/location-card";

export const metadata: Metadata = { title: "Rick & Morty - Locations" };

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
    <div className="pageContainer">
      <h1 className="pageHeading">Locations</h1>
      <Suspense fallback={<FilterBarSkeleton filters={LOCATION_FILTERS} />}>
        <FilterBar filters={LOCATION_FILTERS} />
      </Suspense>
      <Suspense
        fallback={
          <>
            <CountSkeleton />
            <LocationGridSkeleton />
          </>
        }
      >
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
      <p className="pageCount">
        {data.info.count > 0
          ? `${data.info.count} locations found`
          : "No locations found"}
      </p>

      {data.results.length === 0 ? (
        <div className="emptyState">
          <p className="emptyStateText">No locations found.</p>
        </div>
      ) : (
        <TiltGrid minColWidth={280}>
          {data.results.map((loc) => (
            <LocationCard key={loc.id} location={loc} />
          ))}
        </TiltGrid>
      )}

      <Pagination
        info={data.info}
        currentPage={currentPage}
        basePath="/locations"
      />
    </>
  );
}
