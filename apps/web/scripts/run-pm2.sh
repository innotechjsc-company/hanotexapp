#!/usr/bin/env bash
set -euo pipefail

# Simple PM2 helper for this Next.js app
# Usage:
#   bash scripts/run-pm2.sh start   # build (by default) and start via PM2
#   bash scripts/run-pm2.sh restart # restart the app
#   bash scripts/run-pm2.sh stop    # stop the app
#   bash scripts/run-pm2.sh delete  # delete from PM2
#   bash scripts/run-pm2.sh logs    # tail logs
#   bash scripts/run-pm2.sh status  # show PM2 status
#
# Env overrides:
#   APP_NAME=hanotex-web
#   ECOSYSTEM_FILE=ecosystem.config.js
#   BUILD=1 (set to 0 to skip build on start)

APP_NAME="${APP_NAME:-hanotex-web}"
ECOSYSTEM_FILE="${ECOSYSTEM_FILE:-ecosystem.config.js}"
CMD="${1:-start}"

if ! command -v pm2 >/dev/null 2>&1; then
  echo "Error: pm2 is not installed or not in PATH." >&2
  echo "Install: npm i -g pm2" >&2
  exit 1
fi

case "$CMD" in
  start)
    if [ "${BUILD:-1}" = "1" ]; then
      echo "Building Next.js app..."
      if command -v bun >/dev/null 2>&1; then
        bun run build
      else
        npm run build
      fi
    fi
    echo "Starting PM2 with $ECOSYSTEM_FILE ..."
    pm2 start "$ECOSYSTEM_FILE"
    ;;
  restart)
    pm2 restart "$APP_NAME"
    ;;
  stop)
    pm2 stop "$APP_NAME"
    ;;
  delete)
    pm2 delete "$APP_NAME"
    ;;
  logs)
    pm2 logs "$APP_NAME"
    ;;
  status)
    pm2 status "$APP_NAME"
    ;;
  *)
    echo "Usage: $0 {start|restart|stop|delete|logs|status}" >&2
    exit 1
    ;;
esac

echo "Done."

