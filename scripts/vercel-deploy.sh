#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${DOCHUNTER_ENV_FILE:-$HOME/.openclaw/.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

if ! command -v vercel >/dev/null 2>&1; then
  echo "Vercel CLI is required. Install with: npm i -g vercel"
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

if [[ -z "${VERCEL_API_KEY:-}" ]]; then
  echo "VERCEL_API_KEY not found in $ENV_FILE"
  exit 1
fi

cd "$ROOT_DIR"

CMD=(vercel deploy --prod --yes --token "$VERCEL_API_KEY")
if [[ -n "${VERCEL_TEAM_ID:-}" ]]; then
  CMD+=(--scope "$VERCEL_TEAM_ID")
fi

echo "Deploying DocHunter web app to Vercel (token sourced from local machine env file)..."
"${CMD[@]}"