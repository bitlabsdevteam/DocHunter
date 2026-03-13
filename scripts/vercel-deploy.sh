#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OPENCLAW_ENV="$HOME/.openclaw/.env"

if [[ ! -f "$OPENCLAW_ENV" ]]; then
  echo "Missing $OPENCLAW_ENV"
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI is required. Install with: npm i -g vercel"
  exit 1
fi

# shellcheck disable=SC1090
source "$OPENCLAW_ENV"

if [[ -z "${VERCEL_API_KEY:-}" ]]; then
  echo "VERCEL_API_KEY not found in $OPENCLAW_ENV"
  exit 1
fi

cd "$ROOT_DIR"

CMD=(vercel deploy --prod --yes --token "$VERCEL_API_KEY")
if [[ -n "${VERCEL_TEAM_ID:-}" ]]; then
  CMD+=(--scope "$VERCEL_TEAM_ID")
fi

echo "Deploying DocHunter web app to Vercel (token sourced from ~/.openclaw/.env)..."
"${CMD[@]}"
