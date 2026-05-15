import Link from "next/link";
import styles from "./pagination.module.css";
import { ApiInfo } from "@/lib/api/rickMorty/rickMorty.types";

interface PaginationProps {
  info: ApiInfo;
  currentPage: number;
  basePath: string;
}

export function Pagination({ info, currentPage, basePath }: PaginationProps) {
  if (info.pages <= 1) return null;

  function buildHref(page: number) {
    const params = new URLSearchParams();
    params.set("page", String(page));

    return `${basePath}?${params}`;
  }

  const pages = buildPageRange(currentPage, info.pages);

  return (
    <nav className={styles.nav} aria-label="Pagination">
      <PaginationLink
        href={buildHref(1)}
        disabled={currentPage === 1}
        label="First page"
      >
        «
      </PaginationLink>

      <PaginationLink
        href={buildHref(currentPage - 1)}
        disabled={!info.prev}
        label="Previous"
      >
        ←
      </PaginationLink>

      {pages.map((p) => (
        <PaginationLink
          key={p}
          href={buildHref(p)}
          active={p === currentPage}
          label={`Page ${p}`}
        >
          {p}
        </PaginationLink>
      ))}

      <PaginationLink
        href={buildHref(currentPage + 1)}
        disabled={!info.next}
        label="Next"
      >
        →
      </PaginationLink>

      <PaginationLink
        href={buildHref(info.pages)}
        disabled={currentPage === info.pages}
        label="Last page"
      >
        »
      </PaginationLink>
    </nav>
  );
}

function PaginationLink({
  href,
  disabled,
  active,
  label,
  children,
}: {
  href: string;
  disabled?: boolean;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <button
        disabled
        aria-label={label}
        className={`${styles.disabled} ${styles.tooltip}`}
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
      className={`${styles.link} ${styles.tooltip} ${active ? styles.linkActive : styles.linkInactive}`}
      data-tooltip={label}
    >
      {children}
    </Link>
  );
}

function buildPageRange(current: number, total: number): number[] {
  const count = Math.min(5, total);
  let start = Math.max(1, current - Math.floor(count / 2));
  const end = Math.min(total, start + count - 1);
  start = Math.max(1, end - count + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
