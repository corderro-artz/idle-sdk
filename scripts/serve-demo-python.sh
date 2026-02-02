#!/usr/bin/env bash
set -euo pipefail

port="${1:-1337}"
dir="${2:-src/idle-sdk.web}"

python3 -m http.server "$port" --directory "$dir"
