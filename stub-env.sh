#!/usr/bin/env bash
# Auto-stub missing docker-compose env vars into .env
# Usage: ./stub-env.sh [compose-file] [env-file]
#   Defaults: docker-compose.yml  .env

set -euo pipefail

COMPOSE_FILE="${1:-docker-compose.yml}"
ENV_FILE="${2:-.env}"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Error: $COMPOSE_FILE not found" >&2
  exit 1
fi

# Extract all ${VAR} and ${VAR:-default} references from compose file
# Captures just the variable name (strips :- defaults)
mapfile -t COMPOSE_VARS < <(
  grep -oE '\$\{[A-Za-z_][A-Za-z0-9_]*(:-[^}]*)?\}' "$COMPOSE_FILE" \
    | sed 's/\${//; s/}//; s/:-.*//' \
    | sort -u
)

if [[ ${#COMPOSE_VARS[@]} -eq 0 ]]; then
  echo "No \${VAR} references found in $COMPOSE_FILE"
  exit 0
fi

# Read existing keys from .env (handles missing file)
declare -A EXISTING_KEYS
if [[ -f "$ENV_FILE" ]]; then
  while IFS= read -r line || [[ -n "$line" ]]; do
    # Skip blank lines and comments
    [[ -z "$line" || "$line" =~ ^# ]] && continue
    key="${line%%=*}"
    EXISTING_KEYS["$key"]=1
  done < "$ENV_FILE"
fi

# Find missing vars
MISSING=()
for var in "${COMPOSE_VARS[@]}"; do
  if [[ -z "${EXISTING_KEYS[$var]+_}" ]]; then
    MISSING+=("$var")
  fi
done

if [[ ${#MISSING[@]} -eq 0 ]]; then
  echo "All $COMPOSE_FILE vars are already in $ENV_FILE — nothing to stub."
  exit 0
fi

echo "Stubbing ${#MISSING[@]} missing var(s) into $ENV_FILE:"

# Extract default values from compose file for each missing var
declare -A DEFAULTS
while IFS= read -r line; do
  # Match ${VAR:-default} patterns
  if [[ "$line" =~ \$\{([A-Za-z_][A-Za-z0-9_]*):-([^}]*)\} ]]; then
    var="${BASH_REMATCH[1]}"
    default="${BASH_REMATCH[2]}"
    DEFAULTS["$var"]="$default"
  fi
done < "$COMPOSE_FILE"

# Append stubs with a section header
{
  printf '\n# --- auto-stubbed by stub-env.sh ---\n'
  for var in "${MISSING[@]}"; do
    default="${DEFAULTS[$var]:-}"
    printf '%s=%s\n' "$var" "$default"
    echo "  + $var=${default:-(empty)}"
  done
} >> "$ENV_FILE"

# Print added vars to stdout (strip the file-write lines, already echoed above)
echo ""
echo "Done. Review $ENV_FILE and fill in real values."
