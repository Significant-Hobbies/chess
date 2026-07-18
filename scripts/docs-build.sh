#!/usr/bin/env bash
# Build the docs site with Blume → dist/.
#
# IMPORTANT: `dist/` is also the Vite build output for the chess SPA. These are
# two different sites — do not run `pnpm build` and this script at the same
# time. In CI, run them in separate jobs.
#
# Blume is fetched on demand (not a dependency). Pin is held in sync across
# scripts/docs-*.sh and .github/workflows/docs.yml.
set -euo pipefail

BLUME_VERSION="0.8.0"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> blume build (v${BLUME_VERSION}) → dist/"
npx --yes "blume@${BLUME_VERSION}" build

echo "==> docs build complete: dist/"
echo "    Preview with: npx blume@${BLUME_VERSION} preview"
