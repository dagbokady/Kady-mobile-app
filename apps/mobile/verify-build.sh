#!/usr/bin/env bash
# Verification-only static web build for headless preview screenshots.
# Exports the web bundle, then neutralizes `import.meta` (dev-mode checks in a
# dependency) so the classic-script bundle parses, and shims globalThis.__im.
# NOTE: this build is for visual checks only — the real targets are iOS/Android.
set -e
cd "$(dirname "$0")"
rm -rf web-static
npx expo export --platform web --output-dir web-static >/dev/null 2>&1
f=$(ls web-static/_expo/static/js/web/*.js | head -1)
perl -pi -e 's/import\.meta/globalThis.__im/g' "$f"
perl -pi -e 's#(<script src="/_expo/static/js/web/)#<script>globalThis.__im={env:{MODE:"production"}};</script>\n    $1#' web-static/index.html
echo "verify build ready: $f"
