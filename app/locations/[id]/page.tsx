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

export const metadata: Metadata = { title: "Location" };

type Params = Promise<{ id: string }>;

export default function LocationPage({ params }: { params: Params }) {
  return (
    <div className={styles.container}>
      <Link href="/locations" className={styles.backLink}>
        <BiLeftArrowAlt /> Back to locations
      </Link>
      <Suspense fallback={<p>Loading...</p>}>
        <LocationDetail params={params} />
      </Suspense>
    </div>
  );
}

async function LocationDetail({ params }: { params: Params }) {
  const { id } = await params;
  const location = await fetchLocation(Number(id));

  if (!location) notFound();

  const residents = await fetchCharactersByUrls(
    location.residents.slice(0, 20),
  );

  return (
    <>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h1 className={styles.locationName}>{location.name}</h1>
            <p className={styles.locationResidents}>
              {location.residents.length} known resident
              {location.residents.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <dl className={styles.infoGrid}>
          <InfoCard label="Type" value={location.type || "—"} />
          <InfoCard label="Dimension" value={location.dimension || "—"} />
          <InfoCard
            label="Residents"
            value={String(location.residents.length)}
          />
        </dl>
      </div>

      {residents.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>
            Residents
            {location.residents.length > 20 && (
              <span className={styles.sectionNote}>
                (showing first 20 of {location.residents.length})
              </span>
            )}
          </h2>
          <CharacterGrid characters={residents} />
        </section>
      )}
    </>
  );
}
