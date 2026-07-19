#!/usr/bin/env bash
# Validate the docs/ tree with Blume: link check (strict) + render check.
#
# Blume is fetched on demand (not a dependency) so this doesn't touch the
# lockfile. Pin is held in sync across scripts/docs-*.sh and
# .github/workflows/docs.yml — bump together once a version is vetted (>=7 days).
#
# Usage:
#   ./scripts/docs-validate.sh          # internal links, strict
#   ./scripts/docs-validate.sh --external   # also check external links over the network
set -euo pipefail

BLUME_VERSION="0.8.0"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

EXTERNAL=""
if [[ "${1:-}" == "--external" ]]; then
  EXTERNAL="--external"
fi

echo "==> blume validate (v${BLUME_VERSION}) ${EXTERNAL:+(external links on)}"
npx --yes "blume@${BLUME_VERSION}" validate --strict $EXTERNAL

echo "==> blume build (render check, isolated runtime)"
# --isolated builds into .blume-verify/ so a running `blume dev` and the real
# dist/ are left untouched. Skips deploy post-steps (search index, sitemap,
# llms.txt) — we only need to confirm the site compiles and renders.
npx --yes "blume@${BLUME_VERSION}" build --isolated

echo "==> docs OK"
