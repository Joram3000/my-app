"use client";

import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import { Location } from "@/lib/api/rickMorty/rickMorty.types";
import styles from "./location-card.module.css";
import { useSam } from "@/hooks/use-sam";

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <p className={styles.tag}>
      <span className={styles.tagLabel}>{label}</span>
      <span className={styles.tagValue}>{value}</span>
    </p>
  );
}

export function LocationCard({ location }: { location: Location }) {
  const { speak } = useSam();
  return (
    <Link
      href={`/locations/${location.id}`}
      className={styles.card}
      onClick={() => speak(`check out ${location.name}`)}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.name}>{location.name}</h3>
        <span className={styles.arrow}>
          <BiRightArrowAlt />
        </span>
      </div>
      <div className={styles.tagList}>
        <Tag label="Type" value={location.type || "unknown"} />
        <Tag label="Dimension" value={location.dimension || "unknown"} />
        <Tag label="Residents" value={String(location.residents.length)} />
      </div>
    </Link>
  );
}
