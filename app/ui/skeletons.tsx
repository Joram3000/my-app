import styles from "./skeletons.module.css";

function Bone({ className }: { className?: string }) {
  return <div className={`${styles.bone} ${className ?? ""}`} />;
}

/* ── Character card + grid ────────────────────────────────── */
function CharacterCardSkeleton() {
  return (
    <div className={styles.characterCard}>
      <Bone className={`${styles.characterImage}`} />
      <div className={styles.characterBody}>
        <Bone className={styles.characterLine1} />
        <Bone className={styles.characterLine2} />
      </div>
    </div>
  );
}

export function CharacterGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className={styles.characterGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <CharacterCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Location card + grid ─────────────────────────────────── */
function LocationCardSkeleton() {
  return (
    <div className={styles.locationCard}>
      <Bone className={styles.locationName} />
      <div className={styles.locationLines}>
        <Bone className={styles.locationLine1} />
        <Bone className={styles.locationLine2} />
        <Bone className={styles.locationLine3} />
      </div>
    </div>
  );
}

export function LocationGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className={styles.locationGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <LocationCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── Info grid (3-column detail cards) ───────────────────── */
export function InfoGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className={styles.infoGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <Bone key={i} className={styles.infoBlock} />
      ))}
    </div>
  );
}

/* ── Detail card header (badge + title + subtitle) ────────── */
export function DetailHeaderSkeleton({ badge = true }: { badge?: boolean }) {
  return (
    <div className={styles.detailHeader}>
      {badge && <Bone className={`${styles.detailBadge}`} />}
      <div className={styles.detailTextGroup}>
        <Bone className={styles.detailTitle} />
        <Bone className={styles.detailSubtitle} />
      </div>
    </div>
  );
}

/* ── Episode list skeleton ────────────────────────────────── */
export function EpisodeListSkeleton({ seasons = 5, cardsPerSeason = 6 }: { seasons?: number; cardsPerSeason?: number }) {
  return (
    <div>
      <div className={styles.episodeNav}>
        {Array.from({ length: seasons + 1 }).map((_, i) => (
          <Bone key={i} className={styles.episodeNavBtn} />
        ))}
      </div>
      {Array.from({ length: seasons }).map((_, s) => (
        <div key={s} style={{ marginBottom: "2.5rem" }}>
          <Bone style={{ height: "1.25rem", width: "5rem", marginBottom: "1rem" }} className="" />
          <div className={styles.episodeScrollRow}>
            {Array.from({ length: cardsPerSeason }).map((_, i) => (
              <div key={i} className={styles.episodeCard}>
                <Bone className={styles.episodeCardTop} />
                <div className={styles.episodeCardBody}>
                  <Bone className={styles.episodeCardLine1} />
                  <Bone className={styles.episodeCardLine2} />
                  <Bone className={styles.episodeCardLine3} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Character detail page skeleton ──────────────────────── */
export function CharacterDetailSkeleton() {
  return (
    <div className={styles.characterDetailCard}>
      <div className={styles.characterDetailInner}>
        <Bone className={styles.characterDetailImage} />
        <div className={styles.characterDetailInfo}>
          <div className={styles.detailTextGroup}>
            <Bone className={styles.characterDetailName} />
            <Bone className={styles.characterDetailStatus} />
          </div>
          <InfoGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}
