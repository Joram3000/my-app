"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import styles from "./character-modal.module.css";
import { Character } from "@/lib/api/rickMorty/rickMorty.types";

interface CharacterModalProps {
  character: Character;
  onClose: () => void;
}

export function CharacterModal({ character, onClose }: CharacterModalProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal
      aria-label={character.name}
    >
      <div className={styles.backdrop} onClick={onClose} />

      <div className={styles.modal}>
        <button
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className={styles.closeIcon}
            aria-hidden="true"
          >
            <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
          </svg>
        </button>

        <div key={character.id} className={styles.body}>
          <div className={styles.imageWrapper}>
            <Image
              src={character.image}
              alt={character.name}
              fill
              className={styles.image}
              sizes="(max-width: 640px) 100vw, 192px"
            />
          </div>

          <div className={styles.infoSection}>
            <div>
              <div className={styles.nameStatusWrapper}>
                <h1 className={styles.name}>{character.name}</h1>
                <p className={styles.status}>({character.status})</p>
              </div>
            </div>

            <dl className={styles.dl}>
              <InfoRow label="Species" value={character.species} />
              {character.type && (
                <InfoRow label="Type" value={character.type} />
              )}
              <InfoRow label="Gender" value={character.gender} />
              <InfoRow label="Origin" value={character.origin.name} />
              <InfoRow label="Location" value={character.location.name} />
              <InfoRow
                label="Episodes"
                value={`Appears in ${character.episode.length} episode(s)`}
              />
            </dl>

            <div className={styles.footer}>
              <Link
                href={`/characters/${character.id}`}
                onClick={onClose}
                className={styles.profileLink}
              >
                View full profile →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoRow}>
      <dt className={styles.infoLabel}>{label}</dt>
      <dd className={styles.infoValue}>{value}</dd>
    </div>
  );
}
