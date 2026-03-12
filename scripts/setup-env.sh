#!/usr/bin/env bash
set -euo pipefail

if [[ -f .env ]]; then
  echo ".env already exists; leaving it untouched."
  exit 0
fi

cp .env.example .env
echo "Created .env from .env.example"
echo "Fill in required keys before running API calls."
