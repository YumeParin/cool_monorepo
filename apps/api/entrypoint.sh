#!/bin/sh
set -e 

echo "▶ Booting Swissokyo API Environment..."

# --- THE TRUTH SERUM ---
echo "=== DEBUG INFO ==="
echo "1. Checking the air for the database URL:"
echo "DATABASE_URL is -> $DATABASE_URL"
echo "2. Checking the packed files in the DB package:"
ls -la node_modules/@swissokyo/db
echo "=================="
# -----------------------

echo "▶ Applying production database migrations..."
cd node_modules/@swissokyo/db
npx prisma migrate deploy
cd /app

echo "▶ Database ready. Starting Node server..."
exec "$@"