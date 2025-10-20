// file: src/lib/utils.ts
export const regionLabels = [
  "All",
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
  "Antarctic",
] as const;

export type Region = (typeof regionLabels)[number];

export const pageSizeOptions = [12, 24, 48] as const;
