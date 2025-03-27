import globals from "globals";
import pluginJs from "@eslint/js";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {files: ["**/*.js"], languageOptions: {sourceType: "commonjs"}},
  {plugins: "chai-friendly"},
  {rules: {"chai-friendly/no-unused-expressions": "error"}},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
];