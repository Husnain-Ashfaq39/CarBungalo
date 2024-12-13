import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default {
  extends: [
    "next",
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  plugins: ["import", "react", "jsx-a11y"],
  rules: {
 
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["**/*.{js,mjs,cjs,jsx}"],
      languageOptions: { globals: globals.browser },
    },
  ],
};
