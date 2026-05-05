import eslint from "@eslint/js";
import tselint from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/", "dist/", "tsconfig.json", "webpack.config.js"],
  },

  eslint.configs.recommended,

  ...tselint.configs.recommended,

  {
    rules: {
      "no-console": "off",

      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
