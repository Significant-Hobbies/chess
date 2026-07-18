---
title: ADR-0005 — FAQ as a separate Vite entry, not a route
description: Why faq.html is a second Vite input / static page rather than an in-SPA route.
---

# ADR-0005 — FAQ as a separate Vite entry, not a route

**Status:** Accepted
**Date:** 2026-07-18 (backfilled from commits c16a04e, d056c08)

## Context

The FAQ needs to be crawlable (with `FAQPage` JSON-LD) and fast, while the main
app is a client-rendered SPA with little server-rendered copy.

## Decision

`faq.html` is a standalone static page and a second Vite build input
(`vite.config.ts` → `rollupOptions.input.faq`). `vercel.json` routes `/faq` to
`/faq.html`. The FAQ is hand-authored HTML (Tailwind via CDN-free inline styles)
with 15 AI-discoverable questions and `FAQPage` structured data; it is listed in
`sitemap.xml` and linked from the SPA header.

## Consequences

**Positive**

- FAQ is fully crawlable with real HTML + JSON-LD, unlike the SPA shell.
- No router dependency in the SPA.

**Negative / constraints**

- Two build entries to maintain. Forgetting to add a new `.html` page to
  `rollupOptions.input` silently drops it from the build (this exact bug happened
  and was fixed in d056c08).
- FAQ styling is duplicated from the SPA's dark theme tokens (hardcoded in
  `faq.html` `:root` vars) — theme changes must be mirrored manually.

## Alternatives considered

- **In-SPA route** (`/faq` handled by React Router): rejected — SPA rendering
  gives crawlers an empty shell, defeating the SEO/JSON-LD goal.
- **A markdown FAQ rendered at build time**: not chosen; the static HTML keeps
  it dependency-free.
