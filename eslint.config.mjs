import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import vitest from 'eslint-plugin-vitest';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    extends: ["react-app"],
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    files: ['**/*.test.{js,ts,jsx,tsx}'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
];
