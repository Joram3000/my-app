import styles from "./skeletons.module.css";
import { type FilterDef } from "./filter-bar";

function Bone({ className }: { className: string }) {
  return <div className={`${styles.bone} ${className}`} />;
}

function bones(n: number, className: string) {
  return Array.from({ length: n }, (_, i) => <Bone key={i} className={className} />);
}

/* ── Count line ───────────────────────────────────────────── */
export function CountSkeleton() {
  return <Bone className={styles.count} />;
}

/* ── FilterBar ────────────────────────────────────────────── */
export function FilterBarSkeleton({ filters }: { filters: FilterDef[] }) {
  return (
    <div className={styles.filterBar}>
      {filters.map((f, i) => (
        <Bone key={i} className={f.type === "text" ? styles.filterInput : styles.filterSelect} />
      ))}
    </div>
  );
}

/* ── Character card + grid ────────────────────────────────── */
function CharacterCardSkeleton() {
  return (
    <div className={styles.characterCard}>
      <Bone className={styles.characterImage} />
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
      {Array.from({ length: count }, (_, i) => <CharacterCardSkeleton key={i} />)}
    </div>
  );
}

/* ── Location card + grid ─────────────────────────────────── */
function LocationCardSkeleton() {
  return (
    <div className={styles.locationCard}>
      <Bone className={styles.locationName} />
      <div className={styles.locationLines}>
        {bones(3, styles.locationLine)}
      </div>
    </div>
  );
}

export function LocationGridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className={styles.locationGrid}>
      {Array.from({ length: count }, (_, i) => <LocationCardSkeleton key={i} />)}
    </div>
  );
}

/* ── Info grid ────────────────────────────────────────────── */
function InfoGridSkeleton({ count }: { count: number }) {
  return (
    <div className={styles.infoGrid}>
      {bones(count, styles.infoBlock)}
    </div>
  );
}

/* ── Episode list ─────────────────────────────────────────── */
function EpisodeCardSkeleton() {
  return (
    <div className={styles.episodeCard}>
      <Bone className={styles.episodeCardTop} />
      <div className={styles.episodeCardBody}>
        <Bone className={styles.episodeCardLine1} />
        <Bone className={styles.episodeCardLine2} />
        <Bone className={styles.episodeCardLine3} />
      </div>
    </div>
  );
}

export function EpisodeListSkeleton({ seasons = 5, cardsPerSeason = 6 }: { seasons?: number; cardsPerSeason?: number }) {
  return (
    <div>
      <div className={styles.episodeNav}>
        {bones(seasons + 1, styles.episodeNavBtn)}
      </div>
      {Array.from({ length: seasons }, (_, s) => (
        <div key={s} className={styles.episodeSeason}>
          <Bone className={styles.episodeSeasonTitle} />
          <div className={styles.episodeTiltGrid}>
            {Array.from({ length: cardsPerSeason }, (_, i) => <EpisodeCardSkeleton key={i} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Detail skeletons ─────────────────────────────────────── */
export function CharacterDetailSkeleton() {
  return (
    <div className={styles.characterDetailCard}>
      <div className={styles.characterDetailInner}>
        <Bone className={styles.characterDetailImage} />
        <div className={styles.characterDetailInfo}>
          <Bone className={styles.characterDetailName} />
          <Bone className={styles.characterDetailStatus} />
          <InfoGridSkeleton count={6} />
        </div>
      </div>
    </div>
  );
}

export function EpisodeDetailSkeleton() {
  return (
    <div className={styles.detailCard}>
      <div className={styles.detailHeader}>
        <Bone className={styles.detailBadge} />
        <div className={styles.detailTextGroup}>
          <Bone className={styles.detailTitle} />
          <Bone className={styles.detailSubtitle} />
        </div>
      </div>
      <InfoGridSkeleton count={3} />
    </div>
  );
}

export function LocationDetailSkeleton() {
  return (
    <div className={styles.detailCard}>
      <div className={styles.detailTextGroup}>
        <Bone className={styles.detailTitle} />
        <Bone className={styles.detailSubtitle} />
      </div>
      <InfoGridSkeleton count={3} />
    </div>
  );
}
