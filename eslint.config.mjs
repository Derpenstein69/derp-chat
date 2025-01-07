/**
 * @file eslint.config.mjs
 * @description ESLint configuration file for the project.
 * This file sets up the linting rules and configurations for the project.
 * It uses TypeScript ESLint and the recommended configurations from ESLint and TypeScript ESLint.
 * 
 * @module ESLintConfig
 */

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  configPrettier,
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
       * 
       * @rule @typescript-eslint/restrict-template-expressions - Disables the restriction on template expressions.
       * @rule @typescript-eslint/no-empty-object-type - Disables the restriction on empty object types.
       */
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "prettier/prettier": "error",
    },
  },
  {
    /**
     * Files and directories to ignore during linting.
     * 
     * @ignore **/*.js - Ignores all JavaScript files.
     * @ignore **/*.mjs - Ignores all ECMAScript module files.
     */
    ignores: ["**/*.js", "**/*.mjs"],
  },
);
