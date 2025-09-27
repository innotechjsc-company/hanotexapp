#!/bin/bash

# HANOTEX.ONLINE SPECIFIC DEPLOYMENT SCRIPT
# Script đặc biệt cho domain hanotex.online

set -e

echo "🌐 HANOTEX.ONLINE Deployment Script"

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

# Domain configuration
DOMAIN="hanotex.online"
DOMAIN_WWW="www.hanotex.online"

# Get server IP
read -p "Enter your server IP: " SERVER_IP
read -s -p "Enter database password: " DB_PASSWORD
echo
read -s -p "Enter NextAuth secret (min 32 chars): " NEXTAUTH_SECRET
echo
read -s -p "Enter Payload secret (min 32 chars): " PAYLOAD_SECRET
echo

log "Domain: $DOMAIN"
log "Server IP: $SERVER_IP"

# Validate secrets length
if [ ${#NEXTAUTH_SECRET} -lt 32 ]; then
    error "NextAuth secret must be at least 32 characters long"
fi

if [ ${#PAYLOAD_SECRET} -lt 32 ]; then
    error "Payload secret must be at least 32 characters long"
fi

# Update system
log "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential tools
log "Installing essential tools..."
sudo apt install -y curl wget git unzip vim htop ufw fail2ban software-properties-common

# Install Node.js 20
log "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Bun
log "Installing Bun..."
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Install PM2
log "Installing PM2..."
npm install -g pm2

# Install Docker
log "Installing Docker..."
sudo apt remove -y docker docker-engine docker.io containerd runc || true
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker $USER

# Install Nginx
log "Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Install SSL certificates
log "Installing Certbot..."
sudo apt install -y certbot python3-certbot-nginx

# Create project directory
log "Creating project directory..."
sudo mkdir -p /var/www/hanotex
sudo chown $USER:$USER /var/www/hanotex
cd /var/www/hanotex

# Clone repository
log "Cloning HANOTEX repository..."
git clone https://github.com/innotechjsc-company/hanotexapp.git .

# Create environment files
log "Creating environment files..."

# Web app .env
cat > apps/web/.env.local << EOF
NODE_ENV=production
PORT=3000

# API URLs for hanotex.online
NEXT_PUBLIC_API_URL=https://hanotex.online/api
NEXT_PUBLIC_APP_URL=https://hanotex.online
NEXT_PUBLIC_PAYLOAD_API_URL=https://hanotex.online/admin/api

# Database
DATABASE_URL=postgresql://postgres:$DB_PASSWORD@localhost:5432/hanotex-dev

# NextAuth
NEXTAUTH_URL=https://hanotex.online
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
EOF

# CMS .env
cat > apps/cms/.env << EOF
NODE_ENV=production
PORT=4000
DATABASE_URI=postgresql://postgres:$DB_PASSWORD@localhost:5432/hanotex-dev
PAYLOAD_SECRET=$PAYLOAD_SECRET
EOF

# Update docker-compose with production settings
cat > docker-compose.prod.yml << EOF
services:
  postgres:
    image: postgres:15
    container_name: hanotex-postgres-prod
    environment:
      POSTGRES_DB: hanotex-dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: $DB_PASSWORD
    ports:
      - "5432:5432"
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
      - ./database:/docker-entrypoint-initdb.d
    restart: unless-stopped
    networks:
      - hanotex-network

  redis:
    image: redis:7-alpine
    container_name: hanotex-redis-prod
    ports:
      - "6379:6379"
    volumes:
      - redis_prod_data:/data
    restart: unless-stopped
    networks:
      - hanotex-network

volumes:
  postgres_prod_data:
  redis_prod_data:

networks:
  hanotex-network:
    driver: bridge
EOF

# Start database services
log "Starting database services..."
docker compose -f docker-compose.prod.yml up -d postgres redis

# Wait for database to be ready
log "Waiting for database to be ready..."
sleep 30

# Import database schema
log "Importing database schema..."
docker exec -i hanotex-postgres-prod psql -U postgres -d hanotex-dev < database/schema.sql
docker exec -i hanotex-postgres-prod psql -U postgres -d hanotex-dev < database/seed_data.sql

# Install dependencies and build
log "Installing dependencies and building applications..."

# Web app
cd apps/web
npm install
npm run build

# CMS
cd ../cms
npm install
npm run build

# Create PM2 ecosystem files
log "Creating PM2 configuration files..."

# Web app PM2 config
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: "hanotex-web",
      cwd: __dirname,
      script: "npm",
      args: "start",
      exec_mode: "cluster",
      instances: "max",
      autorestart: true,
      watch: false,
      max_memory_restart: "2G",
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/web-error.log",
      out_file: "./logs/web-out.log",
      log_file: "./logs/web-combined.log",
    },
  ],
};
EOF

# CMS PM2 config
cd ../cms
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'hanotex-cms',
      script: 'npm',
      args: 'start',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: './logs/cms-error.log',
      out_file: './logs/cms-out.log',
      log_file: './logs/cms-combined.log',
      max_memory_restart: '1G',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
    },
  ],
};
EOF

# Create logs directories
mkdir -p logs

# Start applications with PM2
log "Starting applications with PM2..."
cd /var/www/hanotex

# Start web app
cd apps/web
pm2 start ecosystem.config.js

# Start CMS
cd ../cms
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup

# Configure Nginx for hanotex.online
log "Configuring Nginx for hanotex.online..."
sudo tee /etc/nginx/sites-available/hanotex > /dev/null << EOF
# Rate limiting
limit_req_zone \$binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone \$binary_remote_addr zone=api:10m rate=100r/m;
limit_req_zone \$binary_remote_addr zone=general:10m rate=50r/m;

# Real IP configuration for Cloudflare
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 104.16.0.0/12;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2a06:98c0::/29;
set_real_ip_from 2c0f:f248::/32;
real_ip_header CF-Connecting-IP;

# Upstream configuration
upstream hanotex_web {
    server 127.0.0.1:3000;
    keepalive 32;
}

upstream hanotex_cms {
    server 127.0.0.1:4000;
    keepalive 32;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name hanotex.online www.hanotex.online;
    return 301 https://\$server_name\$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name hanotex.online www.hanotex.online;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json image/svg+xml;

    # Client settings
    client_max_body_size 50M;
    client_body_timeout 60s;
    client_header_timeout 60s;

    # Static files with caching
    location /_next/static/ {
        proxy_pass http://hanotex_web;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
        expires 1y;
    }

    location /images/ {
        proxy_pass http://hanotex_web;
        proxy_cache_valid 200 30d;
        add_header Cache-Control "public";
        expires 30d;
    }

    # API routes with rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        
        proxy_pass http://hanotex_cms;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header CF-Connecting-IP \$http_cf_connecting_ip;
        proxy_set_header CF-Ray \$http_cf_ray;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # CMS Admin with special rate limiting
    location /admin {
        limit_req zone=login burst=10 nodelay;
        
        proxy_pass http://hanotex_cms;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header CF-Connecting-IP \$http_cf_connecting_ip;
        proxy_cache_bypass \$http_upgrade;
    }

    # Main application
    location / {
        limit_req zone=general burst=50 nodelay;
        
        proxy_pass http://hanotex_web;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header CF-Connecting-IP \$http_cf_connecting_ip;
        proxy_set_header CF-Ray \$http_cf_ray;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        
        # Cache static content
        proxy_cache_valid 200 1h;
        proxy_cache_valid 404 1m;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # Block access to sensitive files
    location ~ /\\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    location ~ \\.(env|log|sql)\$ {
        deny all;
        access_log off;
        log_not_found off;
    }
}
EOF

# Enable Nginx site
sudo ln -s /etc/nginx/sites-available/hanotex /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Configure firewall
log "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw deny 5432
sudo ufw deny 6379

# Setup SSL with Let's Encrypt
log "Setting up SSL certificate for hanotex.online..."
sudo certbot --nginx -d hanotex.online -d www.hanotex.online --non-interactive --agree-tos --email admin@hanotex.online

# Create monitoring script
log "Creating monitoring script for hanotex.online..."
sudo tee /usr/local/bin/hanotex-monitor.sh > /dev/null << EOF
#!/bin/bash

echo "=== HANOTEX.ONLINE MONITORING ==="
echo "Date: \$(date)"
echo ""

# Check PM2 processes
echo "📊 PM2 Status:"
pm2 status

echo ""
echo "🌐 Website Status:"
curl -s -o /dev/null -w "hanotex.online: %{http_code}\n" https://hanotex.online
curl -s -o /dev/null -w "www.hanotex.online: %{http_code}\n" https://www.hanotex.online

echo ""
echo "🔌 API Status:"
curl -s -o /dev/null -w "API: %{http_code}\n" https://hanotex.online/api/technologies

echo ""
echo "🎛️ Admin Status:"
curl -s -o /dev/null -w "Admin: %{http_code}\n" https://hanotex.online/admin

echo ""
echo "🗄️ Database Status:"
docker ps | grep hanotex-postgres-prod > /dev/null && echo "✅ PostgreSQL running" || echo "❌ PostgreSQL down"
docker ps | grep hanotex-redis-prod > /dev/null && echo "✅ Redis running" || echo "❌ Redis down"

echo ""
echo "📈 System Resources:"
echo "CPU Usage: \$(top -bn1 | grep "Cpu(s)" | awk '{print \$2}' | cut -d'%' -f1)%"
echo "Memory Usage: \$(free | grep Mem | awk '{printf("%.1f%%", \$3/\$2 * 100.0)}')"
echo "Disk Usage: \$(df -h / | awk 'NR==2{printf "%s", \$5}')"

echo ""
echo "🔒 SSL Certificate:"
ssl_info=\$(echo | openssl s_client -servername hanotex.online -connect hanotex.online:443 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ -n "\$ssl_info" ]; then
    echo "✅ SSL certificate is valid"
    echo "\$ssl_info"
else
    echo "❌ SSL certificate check failed"
fi
EOF

sudo chmod +x /usr/local/bin/hanotex-monitor.sh

# Setup cron job for monitoring
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/hanotex-monitor.sh >> /var/log/hanotex-monitor.log 2>&1") | crontab -

# Create backup script
log "Creating backup script..."
sudo tee /usr/local/bin/hanotex-backup.sh > /dev/null << EOF
#!/bin/bash

BACKUP_DIR="/backup/hanotex"
DATE=\$(date +%Y%m%d_%H%M%S)

mkdir -p \$BACKUP_DIR

# Backup database
docker exec hanotex-postgres-prod pg_dump -U postgres hanotex-dev | gzip > \$BACKUP_DIR/db_\$DATE.sql.gz

# Backup application files
tar -czf \$BACKUP_DIR/app_\$DATE.tar.gz -C /var/www/hanotex apps/ .env*

# Clean old backups (keep 7 days)
find \$BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: \$DATE"
EOF

sudo chmod +x /usr/local/bin/hanotex-backup.sh

# Setup daily backup
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/hanotex-backup.sh >> /var/log/hanotex-backup.log 2>&1") | crontab -

# Final status check
log "Performing final status check..."
sleep 10

# Check services
pm2 status
sudo systemctl status nginx --no-pager -l
docker ps

log "🎉 HANOTEX.ONLINE deployment completed successfully!"
log "🌐 Website: https://hanotex.online"
log "🌐 Website (www): https://www.hanotex.online"
log "🎛️ Admin: https://hanotex.online/admin"
log "📊 Monitor: /usr/local/bin/hanotex-monitor.sh"
log "💾 Backup: /usr/local/bin/hanotex-backup.sh"

echo ""
info "Next steps:"
info "1. Configure Cloudflare DNS to point to $SERVER_IP"
info "2. Set SSL/TLS mode to 'Full (strict)' in Cloudflare"
info "3. Enable Cloudflare security features"
info "4. Test your website: https://hanotex.online"
info "5. Access admin panel: https://hanotex.online/admin"

echo ""
warning "Important:"
warning "- Change default passwords in production"
warning "- Update environment variables as needed"
warning "- Monitor logs regularly: pm2 logs"
warning "- Setup proper backup strategy"

echo ""
info "🔗 URLs to test:"
info "Main site: https://hanotex.online"
info "WWW site: https://www.hanotex.online"
info "Admin panel: https://hanotex.online/admin"
info "API: https://hanotex.online/api/technologies"
info "Health check: https://hanotex.online/health"
