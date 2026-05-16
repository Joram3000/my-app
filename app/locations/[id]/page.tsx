import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { type Metadata } from "next";
import styles from "./page.module.css";
import {
  fetchCharactersByUrls,
  fetchLocation,
} from "@/lib/api/rickMorty/rickMorty";
import { CharacterGrid } from "@/ui/character-grid";

export const metadata: Metadata = { title: "Location" };

type Params = Promise<{ id: string }>;

export default function LocationPage({ params }: { params: Params }) {
  return (
    <div className={styles.container}>
      <Link href="/locations" className={styles.backLink}>
        ← Back to locations
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
              <span className={styles.sectionNote}>(showing first 20)</span>
            )}
          </h2>
          <CharacterGrid characters={residents} />
        </section>
      )}
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoCard}>
      <dt className={styles.infoLabel}>{label}</dt>
      <dd className={styles.infoValue}>{value}</dd>
    </div>
  );
}
