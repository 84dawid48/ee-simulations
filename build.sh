#!/usr/bin/env bash
# Cloudflare Pages build: publish only the site files (not CLAUDE.md, git files, etc.)
# Build command in Cloudflare: bash build.sh   ·   Build output directory: dist
set -euo pipefail
rm -rf dist
mkdir -p dist
cp index.html _headers dist/
cp -r "סימולציות" dist/
echo "Built: $(find dist -type f | wc -l) files"
