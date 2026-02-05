// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = defineConfig([{
  ignores: [
    ".next/**",
    "node_modules/**",
    "out/**",
    "build/**",
    "dist/**",
    "src/generated/**",
    "*.config.js",
    "*.config.mjs",
    "next-env.d.ts",
  ],
}, ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"), {
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_" },
    ],
  },
}, ...storybook.configs["flat/recommended"]]);

export default eslintConfig;
