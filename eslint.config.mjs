// file: eslint.config.mjs
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import nextPlugin from "@next/eslint-plugin-next";

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // Ignorera genererade mappar
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/out/**", "**/coverage/**"],
  },

  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      "unused-imports": unusedImports,
      "@next/next": nextPlugin,
    },
    rules: {
      /* Next.js rekommenderade regler */
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "off", // vi använder <img> för flaggor ibland
      "@next/next/google-font-display": "warn",
      "@next/next/no-duplicate-head": "error",
      "@next/next/no-sync-scripts": "error",

      /* Kodhygien */
      "unused-imports/no-unused-imports": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      /* Import-ordning */
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      /* Type-only imports preferred */
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
];
