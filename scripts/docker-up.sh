#!/usr/bin/env bash
set -euo pipefail

[[ -f .env ]] || ./scripts/setup-env.sh

docker compose up --build
