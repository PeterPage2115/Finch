#!/bin/sh

# Entrypoint script for frontend Docker container
# Replaces .env.local with Docker-specific configuration

echo "🐳 Docker entrypoint: Konfiguracja środowiska..."

# Remove host's .env.local if it exists
if [ -f /app/.env.local ]; then
  echo "📝 Usuwanie .env.local z hosta..."
  rm -f /app/.env.local
fi

# Create .env.local with Docker-specific values
# UWAGA: BACKEND_API_URL jest używane przez Next.js API Routes (server-side)
# NIE używamy NEXT_PUBLIC_* bo to embeduje URL w browser bundle
echo "✨ Tworzenie .env.local dla Dockera..."
cat > /app/.env.local <<EOF
# Backend API URL - używane przez Next.js API Routes (server-side only)
# Browser łączy się z /api/*, które są proxy do tego URL
BACKEND_API_URL="http://backend:3001"

# Application Configuration
NEXT_PUBLIC_APP_NAME="Tracker Kasy"
NEXT_PUBLIC_APP_VERSION="1.0.0"
EOF

echo "✅ Konfiguracja zakończona!"
echo "🌐 BACKEND_API_URL=http://backend:3001 (server-side only)"
echo "📱 Browser używa relative URLs: /api/*"
echo ""

# Execute the main command
exec "$@"
