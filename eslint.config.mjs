import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginJest from "eslint-plugin-jest";
import reactAppConfig from "eslint-config-react-app";

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
    files: ["**/*.{test,spec}.{js,mjs,cjs,jsx}"],
    plugins: { jest: pluginJest },
    languageOptions: { globals: globals.jest },
    rules: pluginJest.configs.recommended.rules,
  },
];
