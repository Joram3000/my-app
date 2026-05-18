"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./nav-links.module.css";

const links = [
  { href: "/characters", label: "Characters" },
  { href: "/locations", label: "Locations" },
  { href: "/episodes", label: "Episodes" },
];

export function NavLinks() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className={styles.burgerButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <span
          className={`${styles.burgerLine} ${isOpen ? styles.burgerLineTop : ""}`}
        />
        <span
          className={`${styles.burgerLine} ${isOpen ? styles.burgerLineMid : ""}`}
        />
        <span
          className={`${styles.burgerLine} ${isOpen ? styles.burgerLineBot : ""}`}
        />
      </button>

      <nav className={`${styles.nav} ${isOpen ? styles.navOpen : ""}`}>
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`${styles.link} ${pathname.startsWith(href) ? styles.active : styles.inactive}`}
            onClick={() => setIsOpen(false)}
          >
            {label}
          </Link>
        ))}
      </nav>
    </>
  );
}
