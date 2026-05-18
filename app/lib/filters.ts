import { type FilterDef } from "@/ui/filter-bar";

export const CHARACTER_FILTERS: FilterDef[] = [
  { type: "text", key: "name", placeholder: "Search by name…" },
  { type: "select", key: "status", label: "Status", options: ["Alive", "Dead", "unknown"] },
  { type: "text", key: "species", placeholder: "Species…" },
  { type: "select", key: "gender", label: "Gender", options: ["Female", "Male", "Genderless", "unknown"] },
];

export const EPISODE_FILTERS: FilterDef[] = [
  { type: "text", key: "name", placeholder: "Search by name…" },
  { type: "select", key: "season", label: "All seasons", options: ["1", "2", "3", "4", "5"] },
];

export const LOCATION_FILTERS: FilterDef[] = [
  { type: "text", key: "name", placeholder: "Search by name…" },
  { type: "text", key: "type", placeholder: "Type…" },
  { type: "text", key: "dimension", placeholder: "Dimension…" },
];
