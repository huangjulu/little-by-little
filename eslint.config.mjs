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
    "storybook-static/**",
    "tmp/**",
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
}, {
  // 架構邊界：components 不可直接引用 React Query，只能透過 orderApi
  files: ["src/features/**/*.tsx", "src/app/**/*.tsx"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@tanstack/react-query"],
            message:
              "Components 不能直接使用 React Query。請透過 orderApi（或對應的 feature api）存取資料。",
          },
        ],
      },
    ],
  },
}, ...storybook.configs["flat/recommended"]]);

export default eslintConfig;
