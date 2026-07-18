// Blume configuration — presentation layer for the docs/ tree.
//
// The Markdown in docs/ is the source of truth. Blume only renders and indexes
// it. Do not edit docs to satisfy Blume; edit Blume here if a rendering need
// changes. See docs/index.md for the documentation maintenance rules.
//
// Blume is NOT a package dependency (to avoid touching the lockfile / frozen
// installs). The scripts/docs-*.sh helpers and .github/workflows/docs.yml fetch
// a pinned version on demand via `npx --yes blume@0.8.0`. Bump the pin in all
// three places together once a version is vetted (>=7 days old).
//
// Build output: `dist/` — same as the Vite build. The two are different sites;
// never build both at once. See docs/operations/deployment.md.
import { defineConfig } from "blume";

export default defineConfig({
  title: "Chess Coach Docs",
  description:
    "Knowledge system for the Chess Coach repository — product, architecture, decisions, development, operations, and durable learnings.",

  content: {
    root: "docs",
  },

  logo: {
    // Reuses the product favicon (public/favicon.svg). Blume inlines SVG and
    // follows currentColor for light/dark.
    image: "/favicon.svg",
    text: "Chess Coach",
    href: "/",
  },

  github: {
    owner: "Significant-Hobbies",
    repo: "chess",
    branch: "main",
  },

  theme: {
    // Amber matches the in-app accent (#fbbf24) and the LCP shell in index.html.
    accent: "amber",
    radius: "md",
    mode: "dark",
  },

  search: {
    provider: "orama",
  },

  markdown: {
    imageZoom: true,
    code: {
      icons: true,
      wrap: false,
    },
    codeBlocks: {
      theme: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },

  ai: {
    llmsTxt: true,
    mcp: {
      enabled: false,
    },
  },

  seo: {
    og: { enabled: true },
    sitemap: true,
    robots: true,
    structuredData: true,
  },

  lastModified: true,

  deployment: {
    output: "static",
    // Unresolved: docs site domain. Placeholder is the app domain until a
    // dedicated docs subdomain or /docs path is decided. See STATUS.md.
    site: "https://chess.significanthobbies.com",
  },
});
