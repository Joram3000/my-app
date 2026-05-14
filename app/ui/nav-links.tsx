"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./nav-links.module.css";

const links = [
  { href: "/characters", label: "Characters" },
  { href: "/locations", label: "Locations" },
  { href: "/episodes", label: "Episodes" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          className={`${styles.link} ${pathname.startsWith(href) ? styles.active : styles.inactive}`}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
