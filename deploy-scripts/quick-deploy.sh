#!/bin/bash

# HANOTEX QUICK DEPLOYMENT SCRIPT
# Deploy nhanh cho Vultr Ubuntu

set -e

echo "⚡ HANOTEX Quick Deploy for Vultr Ubuntu"

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

# Quick setup function
quick_setup() {
    log "Starting quick setup..."
    
    # Update system
    sudo apt update && sudo apt upgrade -y
    
    # Install essentials
    sudo apt install -y curl wget git unzip vim htop ufw fail2ban
    
    # Install Node.js 20
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
    
    # Install Bun
    curl -fsSL https://bun.sh/install | bash
    source ~/.bashrc
    
    # Install PM2
    npm install -g pm2
    
    # Install Docker
    sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo usermod -aG docker $USER
    
    # Install Nginx
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
}

# Deploy function
deploy_app() {
    log "Deploying HANOTEX application..."
    
    # Create project directory
    sudo mkdir -p /var/www/hanotex
    sudo chown $USER:$USER /var/www/hanotex
    cd /var/www/hanotex
    
    # Clone repository
    git clone https://github.com/innotechjsc-company/hanotexapp.git .
    
    # Start database
    docker compose up -d postgres redis
    
    # Wait for database
    sleep 30
    
    # Import schema
    docker exec -i hanotex-postgres psql -U postgres -d hanotex-dev < database/schema.sql
    
    # Build and start apps
    cd apps/web
    npm install
    npm run build
    pm2 start "npm start" --name "hanotex-web"
    
    cd ../cms
    npm install
    npm run build
    pm2 start "npm start" --name "hanotex-cms"
    
    pm2 save
    pm2 startup
}

# Configure Nginx
configure_nginx() {
    log "Configuring Nginx..."
    
    # Simple Nginx config
    sudo tee /etc/nginx/sites-available/hanotex > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /admin {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
    
    sudo ln -s /etc/nginx/sites-available/hanotex /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl reload nginx
}

# Setup firewall
setup_firewall() {
    log "Setting up firewall..."
    sudo ufw --force enable
    sudo ufw allow OpenSSH
    sudo ufw allow 'Nginx Full'
    sudo ufw deny 5432
    sudo ufw deny 6379
}

# Main execution
main() {
    echo "🚀 HANOTEX Quick Deploy"
    echo "This script will:"
    echo "1. Install all dependencies"
    echo "2. Deploy HANOTEX application"
    echo "3. Configure Nginx"
    echo "4. Setup firewall"
    echo ""
    
    read -p "Continue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    
    quick_setup
    deploy_app
    configure_nginx
    setup_firewall
    
    log "🎉 Quick deployment completed!"
    info "Website: http://$(curl -s ifconfig.me)"
    info "Admin: http://$(curl -s ifconfig.me)/admin"
    info "Monitor: pm2 status"
    info "Logs: pm2 logs"
}

# Run main function
main "$@"
