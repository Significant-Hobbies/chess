---
title: Security Audit
description: Security audit of the chess repo — hosted proxy retirement and local bridge boundary. Canonical security record.
---

# Security Audit — chess

> This is the canonical security record for the repo (moved from `AUDIT.md`).
> Action items are tracked here and in [`STATUS.md`](https://github.com/Significant-Hobbies/chess/blob/main/STATUS.md).

**Date**: 2026-03-28 | **Reviewed**: 2026-08-01 | **Status**: hosted proxy retired

## Secrets in Git History
None found. No `.env`, `.pem`, `.key`, or service-account files in any commit.

## Credentials on Disk
The optional feedback widget reads a caller-owned ingestion URL and does not
ship a SaaS Maker API key. `.gitignore` covers `*.local` so local configuration
is not tracked. No other credential files were found during the audit.

## Deployment
The active Cloudflare Pages workflow uploads only the Vite `dist/` directory.
On 2026-08-01 the dormant Vercel configuration, hosted proxy source, cloud
provider client path, and `@vercel/node` dependency were removed. The two known
historical Vercel aliases returned 404 during verification.

## Code Security
- **Local bridge CORS**: `server/` is a development-only submodule and must bind
  only for local use. It is not deployed or exposed by the maintained Pages
  path.
- **CLI spawn** (`server/index.mjs`): Provider is validated against a fixed allowlist -- no command injection risk.
- No `dangerouslySetInnerHTML` usage. No hardcoded secrets in source.

## Action Items
- [x] Remove the dormant hosted proxy and Vercel configuration.
- [x] Remove browser cloud-provider/API-key configuration.
- [x] Keep the CLI bridge development-only and out of production artifacts.
