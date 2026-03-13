#!/usr/bin/env bash
set -euo pipefail

OPENCLAW_ENV="$HOME/.openclaw/.env"

if [[ ! -f "$OPENCLAW_ENV" ]]; then
  echo "Missing $OPENCLAW_ENV"
  exit 1
fi

# shellcheck disable=SC1090
source "$OPENCLAW_ENV"

if [[ -z "${VERCEL_API_KEY:-}" ]]; then
  echo "VERCEL_API_KEY not found in $OPENCLAW_ENV"
  exit 1
fi

echo "Loaded VERCEL_API_KEY from local OpenClaw env (not written to repo files)."
