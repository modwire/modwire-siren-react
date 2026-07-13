import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["coverage", "dist"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  reactHooks.configs.flat.recommended,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-indexed-object-style": "off",
    },
  },
  {
    files: ["scripts/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["tests/**/*.ts", "tests/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            "../src/*",
            "../../src/*",
            "@modwire/siren-react/dist/*",
            "@modwire/siren-react/src/*",
          ],
        },
      ],
    },
  },
  {
    files: [
      "src/adapters/announcement.ts",
      "src/adapters/browser-event.ts",
      "src/domain/vocabulary/*.ts",
      "src/errors/code.ts",
    ],
    rules: {
      "@typescript-eslint/no-extraneous-class": "off",
    },
  },
  {
    files: ["src/mui/shared/keys.ts"],
    rules: {
      "@typescript-eslint/no-extraneous-class": "off",
    },
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    ignores: [
      "src/adapters/**/*.ts",
      "src/mui/**/*.ts",
      "src/mui/**/*.tsx",
      "src/public/**/*.ts",
      "src/public/**/*.tsx",
      "src/theme/**/*.ts",
      "src/theme/**/*.tsx",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@modwire/siren-ui", "@modwire/siren-ui/*", "@mui/*"],
        },
      ],
    },
  },
);
