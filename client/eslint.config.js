import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react"; // Renamed for clarity
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react: reactPlugin, // Added react plugin
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules, // Added react recommended rules
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "no-unused-vars": "warn",
      "react/react-in-jsx-scope": "off", // Not needed with modern React
      "react/prop-types": "off", // Disable prop-types rule as this project doesn't use them
    },
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  }
];
