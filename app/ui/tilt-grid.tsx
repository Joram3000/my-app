"use client";

import { Children, useEffect, useRef } from "react";
import styles from "./tilt-grid.module.css";

interface TiltGridProps {
  children: React.ReactNode;
  minColWidth?: number;
}

export function TiltGrid({ children, minColWidth }: TiltGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;

    const loop = () => {
      const top = el.getBoundingClientRect().top;
      el.style.setProperty("--origin-y", `${window.innerHeight / 2 - top}px`);
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={gridRef}
      className={styles.grid}
      style={
        {
          ["--min-col" as any]: minColWidth ? `${minColWidth}px` : "100%",
        } as React.CSSProperties
      }
    >
      {Children.map(children, (child, i) => (
        <div key={i} className={styles.cube}>
          <div className={styles.front}>{child}</div>
          <div className={styles.faceTop} />
          <div className={styles.faceBottom} />
          <div className={styles.faceLeft} />
          <div className={styles.faceRight} />
        </div>
      ))}
    </div>
  );
}
