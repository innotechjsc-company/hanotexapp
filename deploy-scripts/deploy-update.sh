#!/bin/bash

# HANOTEX UPDATE DEPLOYMENT SCRIPT
# Cập nhật ứng dụng HANOTEX

set -e

echo "🔄 Starting HANOTEX Update Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "/var/www/hanotex" ]; then
    error "HANOTEX directory not found. Please run setup-server.sh first."
fi

cd /var/www/hanotex

# Create backup before update
log "Creating backup before update..."
/usr/local/bin/hanotex-backup.sh

# Stop applications
log "Stopping applications..."
pm2 stop all

# Pull latest code
log "Pulling latest code from repository..."
git fetch origin
git reset --hard origin/master

# Install/update dependencies
log "Installing dependencies..."

# Web app
cd apps/web
npm install --production

# CMS
cd ../cms
npm install --production

# Build applications
log "Building applications..."

# Web app
cd ../web
npm run build

# CMS
cd ../cms
npm run build

# Restart applications
log "Restarting applications..."
pm2 restart all

# Wait for applications to start
log "Waiting for applications to start..."
sleep 15

# Health check
log "Performing health check..."

# Check PM2 status
if ! pm2 status | grep -q "online"; then
    error "Applications failed to start properly"
fi

# Check website response
if ! curl -s -o /dev/null -w "%{http_code}" https://$(grep NEXT_PUBLIC_APP_URL apps/web/.env.local | cut -d'=' -f2 | sed 's|https://||') | grep -q "200"; then
    warning "Website health check failed, but continuing..."
fi

log "✅ HANOTEX update completed successfully!"

# Show status
pm2 status
echo ""
info "Update completed. Monitor logs with: pm2 logs"
