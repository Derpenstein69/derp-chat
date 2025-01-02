/**
 * ESLint configuration file for the project.
 * This file sets up the linting rules and configurations for the project.
 * It uses TypeScript ESLint and the recommended configurations from ESLint and TypeScript ESLint.
 */

// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      /**
       * Custom rules for the project.
       * These rules override the default recommended rules.
       */
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  {
    /**
     * Files and directories to ignore during linting.
     */
    ignores: ["**/*.js", "**/*.mjs"],
  },
);
