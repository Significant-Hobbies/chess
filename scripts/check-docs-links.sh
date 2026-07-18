#!/usr/bin/env bash
# Lightweight markdown link checker for docs/ + AGENTS.md + STATUS.md + README.md.
#
# Verifies that relative links to files within the repo resolve. Does NOT check
# external URLs (use ./scripts/docs-validate.sh --external for that) and does NOT
# require Blume or network access — intended for fast pre-commit feedback.
#
# Exits non-zero on any broken local link.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

mapfile -t FILES < <(find docs AGENTS.md STATUS.md README.md -type f \( -name '*.md' -o -name '*.mdx' \) 2>/dev/null)

broken=0
for f in "${FILES[@]}"; do
  dir="$(dirname "$f")"
  # Pull every markdown link target out of the file: [text](target).
  while IFS= read -r target; do
    [[ -z "$target" ]] && continue
    # Strip an optional title: [t](url "title") -> url
    target="${target%%\"*}"
    # Skip external / mailto / anchor-only / absolute-served paths.
    case "$target" in
      http://*|https://*|mailto:*|'#'*) continue ;;
      /*) continue ;;  # served at runtime (e.g. /favicon.svg), not a repo file
    esac
    path="${target%%#*}"   # drop trailing anchor
    [[ -z "$path" ]] && continue
    resolved="$dir/$path"
    if [[ ! -e "$resolved" ]]; then
      echo "BROKEN: $f -> $target (resolved: $resolved)" >&2
      broken=$((broken + 1))
    fi
  done < <(grep -oE '\]\([^)]+\)' "$f" | sed -E 's/^\]\(//; s/\)$//')
done

if [[ "$broken" -gt 0 ]]; then
  echo "$broken broken local link(s) found." >&2
  exit 1
fi
echo "All local markdown links resolve."
