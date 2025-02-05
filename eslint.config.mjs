// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
);
