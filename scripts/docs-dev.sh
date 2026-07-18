#!/usr/bin/env bash
# Start the Blume dev server on docs/ with hot reload.
#
# Blume is fetched on demand (not a dependency). Pin is held in sync across
# scripts/docs-*.sh and .github/workflows/docs.yml.
set -euo pipefail

BLUME_VERSION="0.8.0"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

echo "==> blume dev (v${BLUME_VERSION}) on docs/"
exec npx --yes "blume@${BLUME_VERSION}" dev "$@"
