#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${DOCHUNTER_ENV_FILE:-$HOME/.openclaw/.env}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

if [[ -z "${VERCEL_API_KEY:-}" ]]; then
  echo "VERCEL_API_KEY not found in $ENV_FILE"
  exit 1
fi

echo "Loaded VERCEL_API_KEY from local machine env file (not written to repo files)."