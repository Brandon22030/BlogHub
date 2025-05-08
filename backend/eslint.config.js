// d:\MY PROJECTS\BlogHub\backend\eslint.config.js
"use strict"; // Good practice for CommonJS modules

const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const pluginPrettier = require("eslint-plugin-prettier");
const configPrettier = require("eslint-config-prettier"); // Turns off conflicting ESLint rules

module.exports = tseslint.config(
  // Base ESLint recommended rules
  js.configs.recommended,

  // TypeScript-ESLint recommended rules with type checking
  // This automatically configures the TypeScript parser and project settings
  // (languageOptions.parserOptions.project = true)
  // It will look for tsconfig.json relative to this eslint.config.js file.
  ...tseslint.configs.recommendedTypeChecked,
  { // Explicitly set project path for type-aware linting
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,   // Ensures tsconfig.json is found correctly
      },
    },
  },
  // For stricter rules, you could use: ...tseslint.configs.strictTypeChecked,

  // Configuration for Prettier plugin
  // This runs Prettier as an ESLint rule and reports differences.
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
      // The following rules are often turned off when using Prettier,
      // as Prettier handles these formatting aspects.
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
    },
  },

  // IMPORTANT: This MUST be after other shareable configs that include rules.
  // It disables ESLint rules that would conflict with Prettier.
  configPrettier,

  // Global ignores and other project-specific settings
  {
    ignores: [
      "node_modules/",
      "dist/",
      "coverage/",
      "prisma/generated/", // Ignore generated Prisma client
      "eslint.config.js", // Ignore the ESLint config file itself
      // Add other generated files or directories if necessary
    ],
  }
  // Optional: Further customization for specific files or rules
  // Example:
  // {
  //   files: ["**/*.spec.ts", "**/*.e2e-spec.ts"],
  //   // Apply specific rules or disable some for test files
  //   rules: {
  //     "@typescript-eslint/no-explicit-any": "off", // Might be more common in tests
  //   }
  // }
);
