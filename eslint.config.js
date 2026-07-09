import js from "@eslint/js";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "vendor/**", "data/**"]
  },
  js.configs.recommended,
  {
    files: ["src/**/*.js", "assets/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        document: "readonly",
        ol: "readonly",
        window: "readonly"
      }
    },
    rules: {
      "no-var": "off"
    }
  }
];
