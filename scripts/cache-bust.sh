#!/bin/sh
# Stamp main.css / main.js references in every page with a short content hash,
# so browsers fetch the new file whenever it changes (GitHub Pages caches for 10 min).
# Runs from .git/hooks/pre-commit; hashes the staged version of each file.
cd "$(git rev-parse --show-toplevel)" || exit 1

css=$(git show :assets/css/main.css 2>/dev/null | shasum | cut -c1-8)
js=$(git show :assets/js/main.js 2>/dev/null | shasum | cut -c1-8)

for f in *.html; do
  sed -i '' -E \
    -e "s#assets/css/main\.css(\?v=[0-9a-f]*)?\"#assets/css/main.css?v=$css\"#" \
    -e "s#assets/js/main\.js(\?v=[0-9a-f]*)?\"#assets/js/main.js?v=$js\"#" \
    "$f"
  git add "$f"
done
