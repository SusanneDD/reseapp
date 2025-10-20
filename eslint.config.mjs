import next from "@next/eslint-plugin-next";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

/** Flat ESLint v9 config: Next core-web-vitals + TS-parser. */
export default [
  // Ignorera genererat
  { ignores: ["**/node_modules/**", ".next/**", "out/**", "dist/**"] },

  // Bas: JS/TS-filer + Next-regler
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node }
    },
    plugins: { "@next/next": next },
    rules: {
      ...next.configs["core-web-vitals"].rules
      // Lägg egna overrides här vid behov
      // "@next/next/no-img-element": "off",
    }
  },

  // TS-parser (utan type-aware krav -> snabb & stabil)
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: { parser: tsParser }
  }
];
