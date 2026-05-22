"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styles from "./character-modal.module.css";
import { Character } from "@/lib/api/rickMorty/rickMorty.types";
import { useSound } from "@/hooks/use-sound";
import {
  BiRightArrowAlt,
  BiChevronLeft,
  BiChevronRight,
  BiX,
} from "react-icons/bi";
import { useSam } from "@/hooks/use-sam";
import { useCharacterWindow } from "@/hooks/use-character-window";

interface CharacterModalProps {
  characters: Character[];
  initialIndex: number;
  onClose: () => void;
  windowStart?: number;
  totalCount?: number;
  onFetchMore?: (page: number) => Promise<Character[]>;
}

export function CharacterModal({
  characters: initialCharacters,
  initialIndex,
  onClose,
  windowStart = 0,
  totalCount,
  onFetchMore,
}: CharacterModalProps) {
  const noop = useCallback(async (_page: number) => [] as Character[], []);
  const {
    items: characters,
    currentIndex,
    setCurrentIndex,
    windowStart: liveWindowStart,
    hasNext,
    hasPrev,
  } = useCharacterWindow(
    initialCharacters,
    initialIndex,
    windowStart,
    totalCount ?? initialCharacters.length,
    onFetchMore ?? noop,
  );
  const [isClosing, setIsClosing] = useState(false);
  const slidesRef = useRef<HTMLDivElement>(null);
  const currentCharNameRef = useRef(
    initialCharacters[initialIndex]?.name ?? "",
  );
  const ignoreScrollEnd = useRef(initialIndex > 0);

  // When items are prepended, liveWindowStart decreases.
  // Shift scroll instantly so the visible slide doesn't jump.
  const prevWindowStartRef = useRef(windowStart);
  useLayoutEffect(() => {
    const prepended = prevWindowStartRef.current - liveWindowStart;
    prevWindowStartRef.current = liveWindowStart;
    if (prepended > 0) {
      const container = slidesRef.current;
      if (container) {
        ignoreScrollEnd.current = true;
        // Absolute: avoids double-adjustment if scrollLeft drifted before this fires.
        container.scrollLeft = currentIndex * container.clientWidth;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveWindowStart]);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { play } = useSound();
  const { speak } = useSam({ speed: 50 });

  const handleClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  const handleCloseWithSound = useCallback(() => {
    play();
    handleClose();
  }, [play, handleClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button, a[href]")?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const scrollTo = useCallback((index: number) => {
    const container = slidesRef.current;
    if (!container) return;
    container.scrollTo({
      left: index * container.clientWidth,
      behavior: "smooth",
    });
    setCurrentIndex(index);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        if (currentIndex > 0) {
          scrollTo(currentIndex - 1);
          speak("previous");
        }
      } else if (e.key === "ArrowRight") {
        if (hasNext) {
          scrollTo(currentIndex + 1);
          speak("next");
        }
      } else if (e.key === "Escape") {
        speak("close");
        handleClose();
      } else if (e.key === "Tab") {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          "a[href]:not([inert] *), button:not([disabled]):not([inert] *)",
        );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, hasNext, handleClose, scrollTo]);

  useEffect(() => {
    const container = slidesRef.current;
    if (!container) return;
    container.scrollTo({
      left: initialIndex * container.clientWidth,
      behavior: "instant" as ScrollBehavior,
    });
  }, []);

  useEffect(() => {
    currentCharNameRef.current = characters[currentIndex]?.name ?? "";
  }, [characters, currentIndex]);

  useEffect(() => {
    const container = slidesRef.current;
    if (!container) return;
    const handleScrollEnd = () => {
      if (ignoreScrollEnd.current) {
        ignoreScrollEnd.current = false;
        return;
      }
      speak(currentCharNameRef.current);
    };
    container.addEventListener("scrollend", handleScrollEnd);
    return () => container.removeEventListener("scrollend", handleScrollEnd);
  }, [speak]);

  const handleScroll = () => {
    const container = slidesRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    setCurrentIndex(index);
  };

  return (
    <div
      ref={dialogRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={characters[currentIndex].name}
    >
      <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {characters[currentIndex].name}, {currentIndex + 1} of{" "}
        {characters.length}
      </p>

      <div
        className={`${styles.backdrop} ${isClosing ? styles.backdropClosing : ""}`}
        onClick={handleCloseWithSound}
        onAnimationEnd={() => {
          if (isClosing) onClose();
        }}
      />

      <NavButton
        direction="prev"
        onClick={
          hasPrev
            ? () => {
                if (currentIndex > 0) {
                  speak("previous");
                  scrollTo(currentIndex - 1);
                }
              }
            : undefined
        }
        isClosing={isClosing}
      />

      <NavButton
        direction="next"
        onClick={
          hasNext
            ? () => {
                speak("next");
                scrollTo(currentIndex + 1);
              }
            : undefined
        }
        isClosing={isClosing}
      />

      <div
        className={styles.slides}
        ref={slidesRef}
        onScroll={handleScroll}
        onClick={handleCloseWithSound}
      >
        {characters.map((char, i) => (
          <div
            key={char.id}
            className={styles.slide}
            role="group"
            aria-roledescription="slide"
            aria-label={`${char.name}, ${i + 1} of ${characters.length}`}
            inert={i !== currentIndex || undefined}
          >
            {Math.abs(i - currentIndex) <= 1 && (
              <CharacterSlide
                char={char}
                isClosing={isClosing}
                onClose={handleCloseWithSound}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CharacterSlide({
  char,
  isClosing,
  onClose,
}: {
  char: Character;
  isClosing: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={`${styles.modal} ${isClosing ? styles.modalClosing : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={onClose} className={styles.closeButton} aria-label="Close dialog">
        <BiX />
      </button>
      <div className={styles.body}>
        <div className={styles.imageWrapper}>
          <Image
            src={char.image}
            alt={char.name}
            fill
            className={styles.image}
            sizes="(max-width: 640px) 100vw, 192px"
          />
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.name}>{char.name}</h1>

          <dl className={styles.dl}>
            <InfoRow label="Status" value={char.status} />
            <InfoRow
              label="Species"
              value={char.species}
              href={`/characters?species=${encodeURIComponent(char.species)}`}
              onLinkClick={onClose}
            />
            {char.type && <InfoRow label="Type" value={char.type} />}
            <InfoRow
              label="Gender"
              value={char.gender}
              href={`/characters?gender=${encodeURIComponent(char.gender)}`}
              onLinkClick={onClose}
            />
            <InfoRow
              label="Origin"
              value={char.origin.name}
              href={
                char.origin.url
                  ? `/locations/${char.origin.url.split("/").pop()}`
                  : undefined
              }
              onLinkClick={onClose}
            />
            <InfoRow
              label="Location"
              value={char.location.name}
              href={
                char.location.url
                  ? `/locations/${char.location.url.split("/").pop()}`
                  : undefined
              }
              onLinkClick={onClose}
            />
            <InfoRow
              label="Episodes"
              value={`Appears in ${char.episode.length} episode(s)`}
            />
          </dl>

          <div className={styles.footer}>
            <Link href={`/characters/${char.id}`} onClick={onClose} className={styles.profileLink}>
              View full profile
              <BiRightArrowAlt />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavButton({
  direction,
  onClick,
  isClosing,
}: {
  direction: "prev" | "next";
  onClick?: () => void;
  isClosing?: boolean;
}) {
  if (!onClick) return null;
  const isPrev = direction === "prev";
  return (
    <button
      className={`${styles.navButton} ${isPrev ? styles.navPrev : styles.navNext} ${isClosing ? styles.navButtonClosing : ""} tooltip`}
      onClick={onClick}
      data-tooltip={isPrev ? "Previous character" : "Next character"}
      aria-label={isPrev ? "Previous character" : "Next character"}
    >
      {isPrev ? <BiChevronLeft /> : <BiChevronRight />}
    </button>
  );
}

function InfoRow({
  label,
  value,
  href,
  onLinkClick,
}: {
  label: string;
  value: string;
  href?: string;
  onLinkClick?: () => void;
}) {
  return (
    <div className={styles.infoRow}>
      <dt className={styles.infoLabel}>{label}</dt>
      <dd className={styles.infoValue}>
        {href ? (
          <Link href={href} onClick={onLinkClick} className={styles.valueLink}>
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
