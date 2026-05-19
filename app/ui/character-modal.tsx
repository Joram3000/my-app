"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./character-modal.module.css";
import { Character } from "@/lib/api/rickMorty/rickMorty.types";
import {
  BiRightArrowAlt,
  BiChevronLeft,
  BiChevronRight,
  BiX,
} from "react-icons/bi";

interface CharacterModalProps {
  characters: Character[];
  initialIndex: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
  isLoadingNext?: boolean;
  isLoadingPrev?: boolean;
}

export function CharacterModal({
  characters,
  initialIndex,
  onClose,
  onIndexChange,
  isLoadingNext,
  isLoadingPrev,
}: CharacterModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isClosing, setIsClosing] = useState(false);
  const slidesRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    setIsClosing(true);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("button, a[href]")?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const onIndexChangeRef = useRef(onIndexChange);
  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  }, [onIndexChange]);

  const scrollTo = useCallback((index: number) => {
    const container = slidesRef.current;
    if (!container) return;
    container.scrollTo({
      left: index * container.clientWidth,
      behavior: "smooth",
    });
    setCurrentIndex(index);
    onIndexChangeRef.current?.(index);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        scrollTo(Math.max(0, currentIndex - 1));
      } else if (e.key === "ArrowRight") {
        scrollTo(Math.min(characters.length - 1, currentIndex + 1));
      } else if (e.key === "Escape") {
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
  }, [currentIndex, characters.length, handleClose, scrollTo]);

  useEffect(() => {
    const container = slidesRef.current;
    if (!container) return;
    container.scrollTo({
      left: initialIndex * container.clientWidth,
      behavior: "instant" as ScrollBehavior,
    });
  }, []);

  const handleScroll = () => {
    const container = slidesRef.current;
    if (!container) return;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    setCurrentIndex(index);
    onIndexChangeRef.current?.(index);
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
        onClick={handleClose}
        onAnimationEnd={() => { if (isClosing) onClose(); }}
      />

      <NavButton
        direction="prev"
        onClick={
          currentIndex > 0 ? () => scrollTo(currentIndex - 1) : undefined
        }
        isLoading={currentIndex === 0 && isLoadingPrev}
        isClosing={isClosing}
      />

      <NavButton
        direction="next"
        onClick={
          currentIndex < characters.length - 1
            ? () => scrollTo(currentIndex + 1)
            : undefined
        }
        isLoading={currentIndex === characters.length - 1 && isLoadingNext}
        isClosing={isClosing}
      />

      <div
        className={styles.slides}
        ref={slidesRef}
        onScroll={handleScroll}
        onClick={handleClose}
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
            <div className={`${styles.modal} ${isClosing ? styles.modalClosing : ""}`} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleClose}
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
                      onLinkClick={handleClose}
                    />
                    {char.type && <InfoRow label="Type" value={char.type} />}
                    <InfoRow
                      label="Gender"
                      value={char.gender}
                      href={`/characters?gender=${encodeURIComponent(char.gender)}`}
                      onLinkClick={handleClose}
                    />
                    <InfoRow
                      label="Origin"
                      value={char.origin.name}
                      href={
                        char.origin.url
                          ? `/locations/${char.origin.url.split("/").pop()}`
                          : undefined
                      }
                      onLinkClick={handleClose}
                    />
                    <InfoRow
                      label="Location"
                      value={char.location.name}
                      href={
                        char.location.url
                          ? `/locations/${char.location.url.split("/").pop()}`
                          : undefined
                      }
                      onLinkClick={handleClose}
                    />
                    <InfoRow
                      label="Episodes"
                      value={`Appears in ${char.episode.length} episode(s)`}
                    />
                  </dl>

                  <div className={styles.footer}>
                    <Link
                      href={`/characters/${char.id}`}
                      onClick={handleClose}
                      className={styles.profileLink}
                    >
                      View full profile
                      <BiRightArrowAlt />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NavButton({
  direction,
  onClick,
  isLoading,
  isClosing,
}: {
  direction: "prev" | "next";
  onClick?: () => void;
  isLoading?: boolean | null;
  isClosing?: boolean;
}) {
  if (!onClick && !isLoading) return null;
  const isPrev = direction === "prev";
  return (
    <button
      className={`${styles.navButton} ${isPrev ? styles.navPrev : styles.navNext} ${isClosing ? styles.navButtonClosing : ""} tooltip`}
      onClick={onClick}
      disabled={!!isLoading}
      data-tooltip={isPrev ? "Previous character" : "Next character"}
      aria-label={
        isLoading
          ? "Loading more characters"
          : isPrev
            ? "Previous character"
            : "Next character"
      }
    >
      {isLoading ? (
        <span className={styles.spinner} />
      ) : isPrev ? (
        <BiChevronLeft />
      ) : (
        <BiChevronRight />
      )}
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
