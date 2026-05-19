"use client";

import Link from "next/link";
import styles from "./pagination.module.css";
import { ApiInfo } from "@/lib/api/rickMorty/rickMorty.types";
import {
  BiArrowToRight,
  BiArrowToLeft,
  BiLeftArrowAlt,
  BiRightArrowAlt,
} from "react-icons/bi";
import { useSam } from "@/hooks/use-sam";

interface PaginationProps {
  info: ApiInfo;
  currentPage: number;
  basePath: string;
  extraParams?: Record<string, string>;
}

export function Pagination({
  info,
  currentPage,
  basePath,
  extraParams,
}: PaginationProps) {
  const { speak } = useSam();

  if (info.pages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams(extraParams);
    params.set("page", String(page));

    return `${basePath}?${params}`;
  }

  const pages = buildPageRange(currentPage, info.pages, 5);

  return (
    <nav className={styles.nav} aria-label="Pagination">
      {info.pages >= 5 && (
        <PaginationLink
          href={buildHref(1)}
          disabled={currentPage === 1}
          label="First page"
          mobileHidden
          speak={speak}
        >
          <BiArrowToLeft />
        </PaginationLink>
      )}

      <PaginationLink
        href={buildHref(currentPage - 1)}
        disabled={!info.prev}
        label="Previous"
        speak={speak}
      >
        <BiLeftArrowAlt />
      </PaginationLink>

      {pages.map((p) => {
        return (
          <PaginationLink
            key={p}
            href={buildHref(p)}
            active={p === currentPage}
            label={`Page ${p}`}
            speak={speak}
          >
            {p}
          </PaginationLink>
        );
      })}

      <PaginationLink
        href={buildHref(currentPage + 1)}
        disabled={!info.next}
        label="Next"
        speak={speak}
      >
        <BiRightArrowAlt />
      </PaginationLink>

      {info.pages >= 5 && (
        <PaginationLink
          href={buildHref(info.pages)}
          disabled={currentPage === info.pages}
          label="Last page"
          mobileHidden
          speak={speak}
        >
          <BiArrowToRight />
        </PaginationLink>
      )}
    </nav>
  );
}

function PaginationLink({
  href,
  disabled,
  active,
  label,
  mobileHidden,
  style,
  speak,
  children,
}: {
  href: string;
  disabled?: boolean;
  active?: boolean;
  label: string;
  mobileHidden?: boolean;
  style?: React.CSSProperties;
  speak: (text: string) => void;
  children: React.ReactNode;
}) {
  const hiddenClass = mobileHidden ? styles.mobileHidden : "";

  if (disabled) {
    return (
      <button
        disabled
        aria-label={label}
        className={`${styles.disabled} tooltip ${hiddenClass}`}
        data-tooltip={label}
      >
        {children}
      </button>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`${styles.link} tooltip ${active ? styles.linkActive : styles.linkInactive} ${hiddenClass}`}
      data-tooltip={label}
      style={style}
      onClick={() => speak(label)}
    >
      {children}
    </Link>
  );
}

function buildPageRange(
  current: number,
  total: number,
  count: number,
): number[] {
  count = Math.min(count, total);
  let start = Math.max(1, current - Math.floor(count / 2));
  const end = Math.min(total, start + count - 1);
  start = Math.max(1, end - count + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
