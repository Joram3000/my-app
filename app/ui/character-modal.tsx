"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
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
import { useModalKeyboard } from "@/hooks/use-modal-keyboard";
import { useCloseAnimation } from "@/hooks/use-close-animation";

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

  const slidesRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { speak } = useSam({ speed: 50 });

  const { isClosing, triggerClose, handleAnimationEnd } = useCloseAnimation({
    onClose,
    dialogRef,
  });

  const handleCloseWithSound = useCallback(() => {
    triggerClose();
  }, [triggerClose]);

  const scrollTo = useCallback(
    (index: number) => {
      const container = slidesRef.current;
      if (!container) return;
      container.scrollTo({
        left: index * container.clientWidth,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    },
    [setCurrentIndex],
  );

  const handlePrev = useCallback(() => {
    speak("previous");
    scrollTo(currentIndex - 1);
  }, [speak, scrollTo, currentIndex]);

  const handleNext = useCallback(() => {
    speak("next");
    scrollTo(currentIndex + 1);
  }, [speak, scrollTo, currentIndex]);

  const handleCloseWithSpeak = useCallback(() => {
    speak("close");
    triggerClose();
  }, [speak, triggerClose]);

  useModalKeyboard({
    currentIndex,
    hasNext,
    dialogRef,
    onPrev: handlePrev,
    onNext: handleNext,
    onClose: handleCloseWithSpeak,
  });

  // When items are prepended, liveWindowStart decreases.
  // Shift scroll instantly so the visible slide doesn't jump.
  const prevWindowStartRef = useRef(windowStart);
  const ignoreScrollEnd = useRef(initialIndex > 0);
  useLayoutEffect(() => {
    const prepended = prevWindowStartRef.current - liveWindowStart;
    prevWindowStartRef.current = liveWindowStart;
    if (prepended > 0) {
      const container = slidesRef.current;
      if (container) {
        ignoreScrollEnd.current = true;
        container.scrollLeft = currentIndex * container.clientWidth;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveWindowStart]);

  useEffect(() => {
    const container = slidesRef.current;
    if (!container) return;
    container.scrollTo({
      left: initialIndex * container.clientWidth,
      behavior: "instant" as ScrollBehavior,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentCharNameRef = useRef(
    initialCharacters[initialIndex]?.name ?? "",
  );
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

  const handleScroll = useCallback(() => {
    const container = slidesRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    setCurrentIndex(index);
  }, [setCurrentIndex]);

  return (
    <div
      ref={dialogRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={characters[currentIndex].name}
      tabIndex={-1}
    >
      <p className={styles.srOnly} aria-live="polite" aria-atomic="true">
        {characters[currentIndex].name}, {currentIndex + 1} of{" "}
        {characters.length}
      </p>

      <div
        className={`${styles.backdrop} ${isClosing ? styles.backdropClosing : ""}`}
        onClick={handleCloseWithSound}
        onAnimationEnd={handleAnimationEnd}
      />

      <NavButton
        direction="prev"
        onClick={hasPrev ? handlePrev : undefined}
        isClosing={isClosing}
      />

      <NavButton
        direction="next"
        onClick={hasNext ? handleNext : undefined}
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
  const { speak } = useSam({ speed: 50 });

  return (
    <div
      className={`${styles.modal} ${isClosing ? styles.modalClosing : ""}`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => {
          speak("close");
          onClose();
        }}
        className={styles.closeButton}
        aria-label="Close dialog"
      >
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
              onLinkClick={() => {
                speak(char.species);
                onClose();
              }}
            />
            {char.type && <InfoRow label="Type" value={char.type} />}
            <InfoRow
              label="Gender"
              value={char.gender}
              href={`/characters?gender=${encodeURIComponent(char.gender)}`}
              onLinkClick={() => {
                speak(char.gender);
                onClose();
              }}
            />
            <InfoRow
              label="Origin"
              value={char.origin.name}
              href={
                char.origin.url
                  ? `/locations/${char.origin.url.split("/").pop()}`
                  : undefined
              }
              onLinkClick={() => {
                speak(char.origin.name);
                onClose();
              }}
            />
            <InfoRow
              label="Location"
              value={char.location.name}
              href={
                char.location.url
                  ? `/locations/${char.location.url.split("/").pop()}`
                  : undefined
              }
              onLinkClick={() => {
                speak(char.location.name);
                onClose();
              }}
            />
            <InfoRow
              label="Episodes"
              value={`Appears in ${char.episode.length} episode(s)`}
            />
          </dl>

          <div className={styles.footer}>
            <Link
              href={`/characters/${char.id}`}
              onClick={() => {
                speak("view full profile");
                onClose();
              }}
              className={styles.profileLink}
            >
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
