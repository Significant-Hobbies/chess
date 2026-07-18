#!/usr/bin/env bash
# Type-check the Blume site (blume.config.ts + any custom .astro pages).
#
# Blume is fetched on demand (not a dependency). Pin is held in sync across
# scripts/docs-*.sh and .github/workflows/docs.yml.
set -euo pipefail

BLUME_VERSION="0.8.0"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> blume check (v${BLUME_VERSION})"
npx --yes "blume@${BLUME_VERSION}" check --isolated
