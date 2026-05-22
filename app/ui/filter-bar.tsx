"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect, useRef } from "react";
import styles from "./filter-bar.module.css";
import { applyParams } from "@/lib/searchParams";
import { useSam } from "@/hooks/use-sam";

export type FilterDef =
  | { type: "text"; key: string; placeholder: string }
  | { type: "select"; key: string; label: string; options: string[] };

interface FilterBarProps {
  filters: FilterDef[];
}

export function FilterBar({ filters }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { speak } = useSam({ speed: 80 });
  const [textValues, setTextValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of filters) {
      if (f.type === "text") init[f.key] = searchParams.get(f.key) ?? "";
    }
    return init;
  });

  const textValuesRef = useRef(textValues);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Sync local text state when URL changes externally (clear filters, browser back/forward)
  useEffect(() => {
    const fromUrl: Record<string, string> = {};
    for (const f of filters) {
      if (f.type === "text") fromUrl[f.key] = searchParams.get(f.key) ?? "";
    }
    const changed = Object.keys(fromUrl).some(
      (k) => fromUrl[k] !== textValuesRef.current[k],
    );
    if (changed) {
      textValuesRef.current = fromUrl;
      setTextValues(fromUrl);
    }
  }, [searchParams]);

  const handleTextChange = useCallback(
    (key: string, value: string) => {
      const next = { ...textValuesRef.current, [key]: value };
      textValuesRef.current = next;
      setTextValues(next);

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        const params = applyParams(searchParams.toString(), {
          ...next,
          page: undefined,
        });
        router.push(`${pathname}?${params}`);
      }, 300);
    },
    [searchParams, pathname, router],
  );

  const updateSelect = useCallback(
    (key: string, value: string) => {
      speak(value);

      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`${pathname}?${params}`);
    },
    [router, pathname, searchParams, speak],
  );

  const clearAll = useCallback(() => {
    speak("Clear filters");

    if (debounceRef.current) clearTimeout(debounceRef.current);
    router.push(pathname);
  }, [router, pathname, speak]);

  const hasFilters =
    Object.values(textValues).some(Boolean) ||
    filters.some((f) => f.type === "select" && searchParams.has(f.key));

  return (
    <div className={styles.bar}>
      {filters.map((filter) =>
        filter.type === "text" ? (
          <div key={filter.key} className={styles.textField}>
            <input
              type="text"
              placeholder={filter.placeholder}
              value={textValues[filter.key] ?? ""}
              onChange={(e) => handleTextChange(filter.key, e.target.value)}
              className={styles.input}
            />
          </div>
        ) : (
          <div key={filter.key} className={styles.selectField}>
            <select
              value={searchParams.get(filter.key) ?? ""}
              onChange={(e) => updateSelect(filter.key, e.target.value)}
              className={styles.select}
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ),
      )}

      {hasFilters && (
        <button onClick={clearAll} className={styles.clearBtn}>
          Clear filters
        </button>
      )}
    </div>
  );
}
