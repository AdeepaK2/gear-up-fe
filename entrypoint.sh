#!/bin/sh
set -e

# Create runtime config file
if [ -n "$NEXT_PUBLIC_API_URL" ]; then
  echo "Setting runtime API URL to: $NEXT_PUBLIC_API_URL"
  cat > /app/public/config.js <<EOCONFIG
window.__RUNTIME_CONFIG__ = {
  NEXT_PUBLIC_API_URL: '$NEXT_PUBLIC_API_URL'
};
EOCONFIG
fi

# Start Next.js server
exec node server.js
