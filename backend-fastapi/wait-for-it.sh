#!/usr/bin/env bash
# wait-for-it.sh: wait until a TCP host/port are available

set -e

HOST=$1
PORT=$2
shift 2
CMD="$@"

for i in {1..30}; do
  if nc -z "$HOST" "$PORT"; then
    echo "✅ $HOST:$PORT est dispo, on lance l'app..."
    exec $CMD
    exit 0
  fi
  echo "⌛ $HOST:$PORT non dispo, tentative $i/30..."
  sleep 1
done

echo "❌ Timeout après 30s : $HOST:$PORT n'est pas dispo."
exit 1
