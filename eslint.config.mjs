import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  // Patterns are `**/`-prefixed so they also match nested checkouts —
  // e.g. git worktrees under .claude/worktrees/*, which each carry their
  // own .next/ build output and would otherwise be linted.
  globalIgnores([
    // Build / generated output
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "**/dist/**",
    "**/coverage/**",
    "**/next-env.d.ts",
    "**/*.tsbuildinfo",

    // Dependencies (ESLint ignores these by default, but nested checkouts
    // are only covered once the pattern is spelled out).
    "**/node_modules/**",

    // Platform / tooling directories
    "**/.vercel/**",

    // AI tooling — also holds git worktrees of this same repo
    ".claude/**",
    ".codex/**",
    ".superpowers/**",
  ]),
]);

export default eslintConfig;
