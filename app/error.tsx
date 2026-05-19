"use client";

import { useEffect } from "react";
import { useSound } from "@/hooks/use-sound";
import styles from "./not-found.module.css";
import { useSam } from "./hooks/use-sam";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { play } = useSound();
  const { speak } = useSam();

  useEffect(() => {
    console.error(error);
    speak("OOH NOOO ERROR ERROR ERROR ERROR ERROR");
  }, [error]);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.code}>500</h2>
      <p className={styles.message}>Something went wrong</p>
      <button
        onClick={() => {
          play();
          reset();
        }}
        className={styles.link}
      >
        Try again
      </button>
    </div>
  );
}
