#!/usr/bin/env bash
# Validate the docs/ tree with Blume: link check (strict) + render check.
#
# Blume and its isolated Astro renderer are pinned in devDependencies. Keep the
# command pin in sync with package.json and .github/workflows/docs.yml.
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
