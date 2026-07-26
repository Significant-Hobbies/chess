---
title: Security Audit
description: Security audit of the chess repo — open LLM proxy, CORS, key handling. Canonical security record.
---

# Security Audit — chess

> This is the canonical security record for the repo (moved from `AUDIT.md`).
> Action items are tracked here and in [`STATUS.md`](https://github.com/Significant-Hobbies/chess/blob/main/STATUS.md).

**Date**: 2026-03-28 | **Reviewed**: 2026-07-26 | **Status**: Vercel path paused/unknown

## Secrets in Git History
None found. No `.env`, `.pem`, `.key`, or service-account files in any commit.

## Credentials on Disk
`.env.local` contains `VITE_SAASMAKER_API_KEY=pk_...` (public key prefix -- low risk).
`.gitignore` covers `*.local` so this file is not tracked. No other credential files found.

## Deployment
The active Cloudflare Pages workflow uploads only the Vite `dist/` directory;
`api/coach.ts` is not part of that static artifact and therefore does not block
the Pages deploy.

`vercel.json` remains present with SPA rewrite rules. No `.vercel/` directory
or GitHub deployment record was found during the 2026-07-26 review.
`api/coach.ts` is a Vercel serverless function acting as an **open LLM proxy** --
it accepts arbitrary user-supplied API keys and forwards them to
OpenAI/Anthropic/Google/DeepSeek with zero authentication or rate limiting.
Whether an independently configured Vercel deployment still exists remains
unresolved.

## Code Security
- **Wide-open CORS**: `server/index.mjs` (the `cli-bridge` submodule) line 205 uses `app.use(cors())` with no origin restriction. Dev-only, but still worth restricting.
- **Open LLM proxy** (`api/coach.ts`): No auth, no rate limiting. Could be abused for token laundering or billing attacks if the Vercel deployment is live.
- **Google API key in URL**: `api/coach.ts` line 146 passes the API key as a query parameter, which may appear in server logs and CDN caches.
- **CLI spawn** (`server/index.mjs`): Provider is validated against a fixed allowlist -- no command injection risk.
- No `dangerouslySetInnerHTML` usage. No hardcoded secrets in source.

## Action Items
- [ ] Add rate limiting and/or authentication to `api/coach.ts` before any Vercel deployment
- [ ] Restrict CORS origins in `server/index.mjs` to the actual frontend domain
- [ ] Move Google API key from URL query param to request header (`x-goog-api-key`)
- [ ] Confirm any Vercel deployment is paused/deleted if the project is inactive
