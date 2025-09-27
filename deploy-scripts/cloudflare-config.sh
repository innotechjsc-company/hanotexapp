#!/bin/bash

# CLOUDFLARE CONFIGURATION SCRIPT
# Tự động cấu hình Cloudflare cho HANOTEX

set -e

echo "🌐 HANOTEX Cloudflare Configuration Script"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"; }
error() { echo -e "${RED}[ERROR] $1${NC}"; exit 1; }
warning() { echo -e "${YELLOW}[WARNING] $1${NC}"; }
info() { echo -e "${BLUE}[INFO] $1${NC}"; }

# Get user input
read -p "Enter your domain name (e.g., hanotex.com): " DOMAIN
read -p "Enter your Cloudflare Zone ID: " ZONE_ID
read -s -p "Enter your Cloudflare API Token: " API_TOKEN
echo
read -p "Enter your server IP: " SERVER_IP

log "Domain: $DOMAIN"
log "Zone ID: $ZONE_ID"
log "Server IP: $SERVER_IP"

# Install jq if not present
if ! command -v jq &> /dev/null; then
    log "Installing jq..."
    sudo apt update && sudo apt install -y jq
fi

# Function to make Cloudflare API calls
cloudflare_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    
    if [ -n "$data" ]; then
        curl -s -X $method \
            "https://api.cloudflare.com/client/v4$endpoint" \
            -H "Authorization: Bearer $API_TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data"
    else
        curl -s -X $method \
            "https://api.cloudflare.com/client/v4$endpoint" \
            -H "Authorization: Bearer $API_TOKEN" \
            -H "Content-Type: application/json"
    fi
}

# Test API connection
log "Testing Cloudflare API connection..."
response=$(cloudflare_api "GET" "/zones/$ZONE_ID")
if echo "$response" | jq -e '.success' > /dev/null; then
    log "✅ Cloudflare API connection successful"
else
    error "❌ Cloudflare API connection failed. Check your Zone ID and API Token."
fi

# Get current DNS records
log "Fetching current DNS records..."
current_records=$(cloudflare_api "GET" "/zones/$ZONE_ID/dns_records")

# Update or create DNS records
update_dns_record() {
    local name=$1
    local type=$2
    local content=$3
    
    # Check if record exists
    record_id=$(echo "$current_records" | jq -r ".result[] | select(.name == \"$name\" and .type == \"$type\") | .id")
    
    if [ "$record_id" != "null" ] && [ -n "$record_id" ]; then
        log "Updating existing $type record for $name..."
        response=$(cloudflare_api "PUT" "/zones/$ZONE_ID/dns_records/$record_id" "{\"type\":\"$type\",\"name\":\"$name\",\"content\":\"$content\",\"ttl\":1}")
    else
        log "Creating new $type record for $name..."
        response=$(cloudflare_api "POST" "/zones/$ZONE_ID/dns_records" "{\"type\":\"$type\",\"name\":\"$name\",\"content\":\"$content\",\"ttl\":1}")
    fi
    
    if echo "$response" | jq -e '.success' > /dev/null; then
        log "✅ DNS record for $name updated successfully"
    else
        warning "❌ Failed to update DNS record for $name"
        echo "$response" | jq '.errors'
    fi
}

# Configure DNS records
log "Configuring DNS records..."

# A record for root domain
update_dns_record "$DOMAIN" "A" "$SERVER_IP"

# A record for www subdomain
update_dns_record "www.$DOMAIN" "A" "$SERVER_IP"

# CNAME for api subdomain (optional)
read -p "Create CNAME record for api.$DOMAIN? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    update_dns_record "api.$DOMAIN" "CNAME" "$DOMAIN"
fi

# Configure SSL/TLS settings
log "Configuring SSL/TLS settings..."

ssl_settings='{
    "ssl": {
        "value": "strict"
    },
    "always_use_https": {
        "value": "on"
    },
    "hsts": {
        "value": "on"
    }
}'

response=$(cloudflare_api "PATCH" "/zones/$ZONE_ID/settings/ssl" "{\"value\":\"strict\"}")
if echo "$response" | jq -e '.success' > /dev/null; then
    log "✅ SSL/TLS mode set to 'Full (strict)'"
else
    warning "❌ Failed to set SSL/TLS mode"
fi

# Enable Always Use HTTPS
response=$(cloudflare_api "PATCH" "/zones/$ZONE_ID/settings/always_use_https" "{\"value\":\"on\"}")
if echo "$response" | jq -e '.success' > /dev/null; then
    log "✅ Always Use HTTPS enabled"
else
    warning "❌ Failed to enable Always Use HTTPS"
fi

# Configure Page Rules
log "Configuring Page Rules..."

# Function to create/update page rule
update_page_rule() {
    local url=$1
    local settings=$2
    
    # Get existing page rules
    page_rules=$(cloudflare_api "GET" "/zones/$ZONE_ID/pagerules")
    
    # Check if rule exists
    rule_id=$(echo "$page_rules" | jq -r ".result[] | select(.targets[0].constraint.value == \"$url\") | .id")
    
    if [ "$rule_id" != "null" ] && [ -n "$rule_id" ]; then
        log "Updating existing page rule for $url..."
        response=$(cloudflare_api "PUT" "/zones/$ZONE_ID/pagerules/$rule_id" "{\"targets\":[{\"target\":\"url\",\"constraint\":{\"operator\":\"matches\",\"value\":\"$url\"}}],\"actions\":[$settings],\"status\":\"active\"}")
    else
        log "Creating new page rule for $url..."
        response=$(cloudflare_api "POST" "/zones/$ZONE_ID/pagerules" "{\"targets\":[{\"target\":\"url\",\"constraint\":{\"operator\":\"matches\",\"value\":\"$url\"}}],\"actions\":[$settings],\"status\":\"active\"}")
    fi
    
    if echo "$response" | jq -e '.success' > /dev/null; then
        log "✅ Page rule for $url configured successfully"
    else
        warning "❌ Failed to configure page rule for $url"
        echo "$response" | jq '.errors'
    fi
}

# Create Page Rules
update_page_rule "$DOMAIN/_next/static/*" "{\"id\":\"cache_level\",\"value\":\"cache_everything\"},{\"id\":\"edge_cache_ttl\",\"value\":2592000}"
update_page_rule "$DOMAIN/images/*" "{\"id\":\"cache_level\",\"value\":\"cache_everything\"},{\"id\":\"edge_cache_ttl\",\"value\":2592000}"
update_page_rule "$DOMAIN/api/*" "{\"id\":\"cache_level\",\"value\":\"bypass\"}"
update_page_rule "$DOMAIN/admin/*" "{\"id\":\"cache_level\",\"value\":\"bypass\"}"

# Configure Security Settings
log "Configuring security settings..."

# Enable Bot Fight Mode
response=$(cloudflare_api "PATCH" "/zones/$ZONE_ID/settings/bot_fight_mode" "{\"value\":\"on\"}")
if echo "$response" | jq -e '.success' > /dev/null; then
    log "✅ Bot Fight Mode enabled"
else
    warning "❌ Failed to enable Bot Fight Mode"
fi

# Set Security Level to Medium
response=$(cloudflare_api "PATCH" "/zones/$ZONE_ID/settings/security_level" "{\"value\":\"medium\"}")
if echo "$response" | jq -e '.success' > /dev/null; then
    log "✅ Security level set to Medium"
else
    warning "❌ Failed to set security level"
fi

# Configure Speed Settings
log "Configuring speed optimizations..."

# Enable Auto Minify
response=$(cloudflare_api "PATCH" "/zones/$ZONE_ID/settings/minify" "{\"value\":{\"css\":\"on\",\"html\":\"on\",\"js\":\"on\"}}")
if echo "$response" | jq -e '.success' > /dev/null; then
    log "✅ Auto Minify enabled for CSS, HTML, and JS"
else
    warning "❌ Failed to enable Auto Minify"
fi

# Enable Brotli
response=$(cloudflare_api "PATCH" "/zones/$ZONE_ID/settings/brotli" "{\"value\":\"on\"}")
if echo "$response" | jq -e '.success' > /dev/null; then
    log "✅ Brotli compression enabled"
else
    warning "❌ Failed to enable Brotli"
fi

# Configure Browser Cache TTL
response=$(cloudflare_api "PATCH" "/zones/$ZONE_ID/settings/browser_cache_ttl" "{\"value\":14400}")
if echo "$response" | jq -e '.success' > /dev/null; then
    log "✅ Browser Cache TTL set to 4 hours"
else
    warning "❌ Failed to set Browser Cache TTL"
fi

# Create Firewall Rules (Rate Limiting)
log "Configuring rate limiting rules..."

# Rate limiting rule for login attempts
rate_limit_data='{
    "expression": "(http.request.uri.path contains \"/admin\" or http.request.uri.path contains \"/api/auth\")",
    "action": "managed_challenge",
    "ratelimit": {
        "threshold": 10,
        "period": 60,
        "match": "all"
    }
}'

response=$(cloudflare_api "POST" "/zones/$ZONE_ID/firewall/rules" "$rate_limit_data")
if echo "$response" | jq -e '.success' > /dev/null; then
    log "✅ Rate limiting rule created for admin/auth endpoints"
else
    warning "❌ Failed to create rate limiting rule"
fi

# Configure Development Mode (if needed)
read -p "Enable Development Mode (bypass cache)? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    response=$(cloudflare_api "PATCH" "/zones/$ZONE_ID/settings/development_mode" "{\"value\":\"on\"}")
    if echo "$response" | jq -e '.success' > /dev/null; then
        log "✅ Development Mode enabled (cache bypassed for 3 hours)"
    else
        warning "❌ Failed to enable Development Mode"
    fi
fi

# Purge cache
log "Purging Cloudflare cache..."
response=$(cloudflare_api "POST" "/zones/$ZONE_ID/purge_cache" "{\"purge_everything\":true}")
if echo "$response" | jq -e '.success' > /dev/null; then
    log "✅ Cloudflare cache purged successfully"
else
    warning "❌ Failed to purge cache"
fi

# Create monitoring script for Cloudflare
log "Creating Cloudflare monitoring script..."

sudo tee /usr/local/bin/cloudflare-monitor.sh > /dev/null << EOF
#!/bin/bash

echo "=== CLOUDFLARE MONITORING ==="
echo "Date: \$(date)"
echo ""

# Check DNS resolution
echo "🌐 DNS Resolution:"
nslookup $DOMAIN | grep -q "$SERVER_IP" && echo "✅ $DOMAIN resolves to $SERVER_IP" || echo "❌ DNS resolution failed"

# Check SSL certificate
echo ""
echo "🔒 SSL Certificate:"
ssl_info=\$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ -n "\$ssl_info" ]; then
    echo "✅ SSL certificate is valid"
    echo "\$ssl_info"
else
    echo "❌ SSL certificate check failed"
fi

# Check Cloudflare headers
echo ""
echo "☁️ Cloudflare Headers:"
cf_headers=\$(curl -s -I https://$DOMAIN | grep -i cloudflare)
if [ -n "\$cf_headers" ]; then
    echo "✅ Cloudflare headers present"
    echo "\$cf_headers"
else
    echo "❌ Cloudflare headers not found"
fi

# Check website response
echo ""
echo "🌍 Website Status:"
response_code=\$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN)
if [ "\$response_code" = "200" ]; then
    echo "✅ Website responding with HTTP 200"
else
    echo "❌ Website responding with HTTP \$response_code"
fi

# Check API
echo ""
echo "🔌 API Status:"
api_response=\$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/technologies)
if [ "\$api_response" = "200" ]; then
    echo "✅ API responding with HTTP 200"
else
    echo "❌ API responding with HTTP \$api_response"
fi

# Check admin
echo ""
echo "🎛️ Admin Status:"
admin_response=\$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/admin)
if [ "\$admin_response" = "200" ]; then
    echo "✅ Admin panel responding with HTTP 200"
else
    echo "❌ Admin panel responding with HTTP \$admin_response"
fi

# Check Cloudflare analytics (if API access available)
echo ""
echo "📊 Cloudflare Analytics (Last 24h):"
analytics=\$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/analytics/dashboard" -H "Authorization: Bearer $API_TOKEN" -H "Content-Type: application/json")
if echo "\$analytics" | jq -e '.success' > /dev/null; then
    requests=\$(echo "\$analytics" | jq -r '.result.totals.requests.all')
    bandwidth=\$(echo "\$analytics" | jq -r '.result.totals.bandwidth.all')
    threats=\$(echo "\$analytics" | jq -r '.result.totals.threats.all')
    echo "✅ Requests: \$requests"
    echo "✅ Bandwidth: \$bandwidth bytes"
    echo "✅ Threats blocked: \$threats"
else
    echo "❌ Failed to fetch Cloudflare analytics"
fi
EOF

sudo chmod +x /usr/local/bin/cloudflare-monitor.sh

# Add to crontab
(crontab -l 2>/dev/null; echo "*/10 * * * * /usr/local/bin/cloudflare-monitor.sh >> /var/log/cloudflare-monitor.log 2>&1") | crontab -

# Final summary
log "🎉 Cloudflare configuration completed!"
echo ""
info "📋 Configuration Summary:"
info "✅ DNS records configured for $DOMAIN"
info "✅ SSL/TLS set to Full (strict)"
info "✅ Always Use HTTPS enabled"
info "✅ Page Rules configured for caching"
info "✅ Security settings enabled"
info "✅ Speed optimizations enabled"
info "✅ Rate limiting configured"
info "✅ Cache purged"
info "✅ Monitoring script created"

echo ""
info "🔗 URLs to test:"
info "Website: https://$DOMAIN"
info "API: https://$DOMAIN/api/technologies"
info "Admin: https://$DOMAIN/admin"

echo ""
info "📊 Monitoring:"
info "Run: /usr/local/bin/cloudflare-monitor.sh"
info "Logs: /var/log/cloudflare-monitor.log"

echo ""
warning "⚠️ Important Notes:"
warning "1. DNS propagation may take up to 24 hours"
warning "2. SSL certificate will be issued by Cloudflare"
warning "3. Monitor logs for any issues"
warning "4. Development Mode expires in 3 hours (if enabled)"

echo ""
info "🚀 Your HANOTEX application is now configured with Cloudflare!"
