// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expo = require("eslint-config-expo/flat");
const prettier = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");

module.exports = defineConfig([
  ...expo,
  {
    ignores: [
      "dist/*",
      ".expo/*",
      "android/*",
      "ios/*",
      ".yarn/*",
      "node_modules/*",
    ],
  },
  prettier,
  {
    plugins: { prettier: prettierPlugin },
    rules: { "prettier/prettier": "warn" },
  },
]);
