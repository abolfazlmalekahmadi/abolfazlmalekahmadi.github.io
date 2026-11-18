#!/usr/bin/env bash
# Build the static site locally and publish ./out to the gh-pages branch.
# Use this while GitHub Actions is unavailable on the account.
# Pages setting: Settings → Pages → Deploy from a branch → gh-pages / (root).
set -euo pipefail
cd "$(dirname "$0")/.."

REMOTE="$(git remote get-url origin)"
REPO="$(basename -s .git "$REMOTE")"
if [[ "$REPO" == *.github.io ]]; then BASE=""; else BASE="/$REPO"; fi

NEXT_PUBLIC_BASE_PATH="$BASE" npm run build
touch out/.nojekyll

cd out
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
git push -f -q "$REMOTE" gh-pages
rm -rf .git
echo "Published to gh-pages ($REMOTE)"
