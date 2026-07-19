---
title: ADR-0002 — Cloud AI via a serverless proxy
description: Why cloud AI providers are reached through api/coach.ts instead of directly from the browser.
---

# ADR-0002 — Cloud AI via a serverless proxy

**Status:** Accepted (with an open security blocker — see below)
**Date:** 2026-07-17 (backfilled)

## Context

Cloud AI providers (OpenAI, Anthropic, Google, DeepSeek) each have different
request shapes, auth headers, and SSE delta formats. The browser could call them
directly, but CORS and key exposure make that awkward.

## Decision

`api/coach.ts` is a Vercel serverless function that accepts a normalized request
(`provider`, `model`, `apiKey`, `messages`, `systemPrompt`), validates the
provider against an allowlist, and forwards to the correct upstream, streaming the
upstream SSE response back to the client unchanged. The client (`useAI.ts`) keeps
per-provider SSE parsers.

## Consequences

**Positive**

- One client code path for all cloud providers; provider quirks live server-side.
- The client never has to handle per-provider CORS.
- Easy to add a new OpenAI-compatible provider (just add a URL to
  `OPENAI_COMPAT_URLS`).

**Negative / open blocker**

- The proxy is currently an **open LLM proxy**: no auth, no rate limiting, accepts
  arbitrary user-supplied keys. This is the primary security blocker before any
  broader promotion. See [operations/security-audit](../../operations/security-audit.md).
- Google's API key is passed as a URL query param (`?key=...`), which can appear
  in server/CDN logs. Action item: move to `x-goog-api-key` header.
- `max_tokens` is hardcoded to 512 for Anthropic (sufficient for the 3-sentence
  coaching format, but a hidden constraint if the prompt format ever grows).

## Alternatives considered

- **Direct browser → provider calls**: rejected — CORS inconsistencies and the
  Google key-in-URL problem would move to the client.
- **A single normalized upstream gateway** (e.g. OpenRouter): not chosen; the
  proxy already normalizes enough and keeps provider-specific streaming intact.
