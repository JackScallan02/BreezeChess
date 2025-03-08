import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginJest from "eslint-plugin-jest";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
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
    // Add Jest globals so ESLint recognizes things like `describe` and `it`
    languageOptions: { globals: globals.jest },
    // Use the recommended Jest rules
    rules: pluginJest.configs.recommended.rules,
  },
];