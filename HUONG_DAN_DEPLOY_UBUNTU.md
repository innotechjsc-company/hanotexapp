# HƯỚNG DẪN DEPLOY DỰ ÁN HANOTEX LÊN SERVER UBUNTU

## 📋 TỔNG QUAN

Tài liệu này hướng dẫn chi tiết cách deploy dự án HANOTEX lên server Ubuntu với các môi trường:
- **Development/Staging**: Để test và phát triển
- **Production**: Để chạy thật với người dùng

---

## 🛠️ YÊU CẦU SERVER

### 1. Cấu hình tối thiểu

| Môi trường | CPU | RAM | Storage | Bandwidth |
|------------|-----|-----|---------|-----------|
| **Development** | 2 cores | 4GB | 50GB SSD | 100 Mbps |
| **Staging** | 2 cores | 8GB | 100GB SSD | 500 Mbps |
| **Production** | 4+ cores | 16GB+ | 200GB+ SSD | 1 Gbps |

### 2. Hệ điều hành
- **Ubuntu Server**: 20.04 LTS hoặc 22.04 LTS
- **Quyền**: Root hoặc user có sudo privileges
- **Network**: IP tĩnh hoặc domain name

---

## 📦 CÀI ĐẶT MÔI TRƯỜNG SERVER

### Bước 1: Cập nhật hệ thống

```bash
# Kết nối SSH vào server
ssh username@your-server-ip

# Cập nhật package list
sudo apt update && sudo apt upgrade -y

# Cài đặt các tools cơ bản
sudo apt install -y curl wget git unzip vim htop ufw fail2ban
```

### Bước 2: Cài đặt Node.js

```bash
# Cài đặt NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Cài đặt Node.js
sudo apt install -y nodejs

# Kiểm tra phiên bản
node --version  # Should be v20.x.x
npm --version

# Cài đặt yarn (khuyến nghị)
npm install -g yarn

# Cài đặt PM2 (Process Manager)
npm install -g pm2
```

### Bước 3: Cài đặt Docker

```bash
# Gỡ bỏ phiên bản cũ (nếu có)
sudo apt remove docker docker-engine docker.io containerd runc

# Cài đặt dependencies
sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Thêm Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Thêm Docker repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Cài đặt Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Thêm user vào Docker group
sudo usermod -aG docker $USER

# Khởi động Docker
sudo systemctl enable docker
sudo systemctl start docker

# Kiểm tra
docker --version
docker compose version
```

### Bước 4: Cài đặt Nginx

```bash
# Cài đặt Nginx
sudo apt install -y nginx

# Khởi động và enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Kiểm tra trạng thái
sudo systemctl status nginx
```

### Bước 5: Cài đặt SSL Certificate (Let's Encrypt)

```bash
# Cài đặt Certbot
sudo apt install -y certbot python3-certbot-nginx

# Tạo SSL certificate (thay your-domain.com bằng domain thật)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Setup auto-renewal
sudo crontab -e
# Thêm dòng sau:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🚀 DEPLOY ỨNG DỤNG

### Phương pháp 1: Deploy với Docker (Khuyến nghị)

#### Bước 1: Tạo thư mục dự án

```bash
# Tạo thư mục cho ứng dụng
sudo mkdir -p /var/www/hanotex
sudo chown $USER:$USER /var/www/hanotex
cd /var/www/hanotex

# Clone dự án
git clone https://github.com/your-username/skhcnHN.git .
cd hanotex-app
```

#### Bước 2: Cấu hình môi trường

```bash
# Tạo file .env cho production
cat > .env.production << 'EOF'
# Database Configuration
POSTGRES_DB=hanotex_prod
POSTGRES_USER=hanotex_user
POSTGRES_PASSWORD=your-super-secure-password-here

# Redis Configuration
REDIS_PASSWORD=your-redis-password-here

# Application Configuration
NODE_ENV=production
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
CORS_ORIGIN=https://your-domain.com

# Email Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@your-domain.com

# SSL Configuration
SSL_CERT_PATH=/etc/letsencrypt/live/your-domain.com/fullchain.pem
SSL_KEY_PATH=/etc/letsencrypt/live/your-domain.com/privkey.pem
EOF

# Tạo file .env.local cho web app
cat > apps/web/.env.local << 'EOF'
# NextAuth Configuration
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-super-secret-key-change-in-production

# API Configuration
NEXT_PUBLIC_API_URL=https://your-domain.com/api/v1
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_WS_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://hanotex_user:your-super-secure-password-here@localhost:5432/hanotex_prod

# Redis
REDIS_URL=redis://:your-redis-password-here@localhost:6379
EOF
```

#### Bước 3: Tạo Docker Compose cho Production

```bash
# Tạo docker-compose.prod.yml
cat > docker-compose.prod.yml << 'EOF'
services:
  postgres:
    image: postgres:15
    container_name: hanotex-postgres-prod
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
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
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_prod_data:/data
    restart: unless-stopped
    networks:
      - hanotex-network

  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile.prod
    container_name: hanotex-web-prod
    environment:
      - NODE_ENV=production
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
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
```

#### Bước 4: Tạo Dockerfile cho Production

```bash
# Tạo Dockerfile.prod trong apps/web/
cat > apps/web/Dockerfile.prod << 'EOF'
# Multi-stage build
FROM node:20-alpine AS dependencies
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN yarn build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["node", "server.js"]
EOF

# Cập nhật next.config.js để hỗ trợ standalone
cat >> apps/web/next.config.js << 'EOF'

// Thêm vào cuối file
const nextConfig = {
  output: 'standalone',
  // ... các config khác
}
EOF
```

#### Bước 5: Build và Deploy

```bash
# Load environment variables
set -a
source .env.production
set +a

# Build và start services
docker compose -f docker-compose.prod.yml up -d --build

# Kiểm tra trạng thái
docker compose -f docker-compose.prod.yml ps

# Xem logs
docker compose -f docker-compose.prod.yml logs -f
```

### Phương pháp 2: Deploy truyền thống (không dùng Docker)

#### Bước 1: Setup database

```bash
# Cài đặt PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Tạo user và database
sudo -u postgres psql << 'EOF'
CREATE USER hanotex_user WITH PASSWORD 'your-secure-password';
CREATE DATABASE hanotex_prod OWNER hanotex_user;
GRANT ALL PRIVILEGES ON DATABASE hanotex_prod TO hanotex_user;
\q
EOF

# Import schema và data
sudo -u postgres psql -d hanotex_prod < database/schema.sql
sudo -u postgres psql -d hanotex_prod < database/seed_data.sql
```

#### Bước 2: Setup Redis

```bash
# Cài đặt Redis
sudo apt install -y redis-server

# Cấu hình Redis
sudo nano /etc/redis/redis.conf
# Uncomment và set: requirepass your-redis-password

# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

#### Bước 3: Deploy ứng dụng

```bash
# Clone và setup
cd /var/www/hanotex
git clone https://github.com/your-username/skhcnHN.git .
cd hanotex-app

# Install dependencies
npm install

# Build ứng dụng
npm run build

# Setup PM2 ecosystem
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'hanotex-web',
    script: 'apps/web/server.js',
    cwd: '/var/www/hanotex/hanotex-app',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Tạo thư mục logs
mkdir -p logs

# Start với PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## 🔒 CÀI ĐẶT BẢO MẬT

### 1. Firewall (UFW)

```bash
# Enable UFW
sudo ufw enable

# Cho phép SSH
sudo ufw allow OpenSSH

# Cho phép HTTP và HTTPS
sudo ufw allow 'Nginx Full'

# Chặn direct access vào database
sudo ufw deny 5432
sudo ufw deny 6379

# Kiểm tra status
sudo ufw status
```

### 2. Fail2Ban

```bash
# Cấu hình Fail2Ban cho SSH
sudo nano /etc/fail2ban/jail.local

# Thêm nội dung:
cat > /tmp/jail.local << 'EOF'
[DEFAULT]
bantime = 10m
findtime = 10m
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s

[nginx-http-auth]
enabled = true

[nginx-noscript]
enabled = true

[nginx-badbots]
enabled = true
EOF

sudo mv /tmp/jail.local /etc/fail2ban/
sudo systemctl restart fail2ban
```

### 3. Database Security

```bash
# Cấu hình PostgreSQL security
sudo nano /etc/postgresql/*/main/pg_hba.conf

# Thay đổi authentication method:
# local   all   all   peer
# host    all   all   127.0.0.1/32   md5

# Restart PostgreSQL
sudo systemctl restart postgresql

# Backup database
sudo -u postgres pg_dump hanotex_prod > /backup/hanotex_$(date +%Y%m%d).sql
```

---

## 🌐 CẤU HÌNH NGINX

### 1. Tạo server block

```bash
# Tạo cấu hình Nginx
sudo nano /etc/nginx/sites-available/hanotex

# Thêm cấu hình:
cat > /tmp/hanotex << 'EOF'
# Rate limiting
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;

# Upstream for load balancing
upstream hanotex_app {
    server 127.0.0.1:3000;
    # Thêm nhiều servers nếu có:
    # server 127.0.0.1:3001;
    # server 127.0.0.1:3002;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Static files
    location /_next/static/ {
        alias /var/www/hanotex/hanotex-app/apps/web/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # File uploads
    location /uploads/ {
        alias /var/www/hanotex/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # API routes with rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://hanotex_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Login rate limiting
    location /api/auth/login {
        limit_req zone=login burst=5 nodelay;
        proxy_pass http://hanotex_app;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Main application
    location / {
        proxy_pass http://hanotex_app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF

sudo mv /tmp/hanotex /etc/nginx/sites-available/

# Enable site
sudo ln -s /etc/nginx/sites-available/hanotex /etc/nginx/sites-enabled/

# Test và reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

---

## 📊 MONITORING VÀ LOGGING

### 1. Setup log rotation

```bash
# Tạo logrotate config
sudo nano /etc/logrotate.d/hanotex

cat > /tmp/hanotex-logrotate << 'EOF'
/var/www/hanotex/hanotex-app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

sudo mv /tmp/hanotex-logrotate /etc/logrotate.d/hanotex
```

### 2. Setup monitoring với PM2

```bash
# Install PM2 monitoring
pm2 install pm2-logrotate

# Cấu hình PM2 monitoring
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:rotateInterval '0 0 * * *'

# Setup PM2 web monitoring (optional)
pm2 web
```

### 3. Database backup script

```bash
# Tạo backup script
cat > /usr/local/bin/backup-hanotex.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup/hanotex"
DATE=$(date +%Y%m%d_%H%M%S)

# Tạo thư mục backup
mkdir -p $BACKUP_DIR

# Backup database
sudo -u postgres pg_dump hanotex_prod | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz -C /var/www/hanotex uploads/ .env.production

# Xóa backup cũ hơn 30 ngày
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
EOF

chmod +x /usr/local/bin/backup-hanotex.sh

# Setup cron job
crontab -e
# Thêm dòng sau để backup hàng ngày lúc 2:00 AM:
# 0 2 * * * /usr/local/bin/backup-hanotex.sh >> /var/log/backup.log 2>&1
```

---

## 🔄 CI/CD DEPLOYMENT

### 1. Setup GitHub Actions (optional)

```bash
# Tạo script deploy
cat > /usr/local/bin/deploy-hanotex.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting HANOTEX deployment..."

# Backup trước khi deploy
/usr/local/bin/backup-hanotex.sh

# Pull latest code
cd /var/www/hanotex
git pull origin main

# Install dependencies
cd hanotex-app
npm install --production

# Build application
npm run build

# Restart PM2
pm2 restart ecosystem.config.js

# Reload Nginx
sudo systemctl reload nginx

echo "Deployment completed successfully!"
EOF

chmod +x /usr/local/bin/deploy-hanotex.sh
```

### 2. Setup webhook (optional)

```bash
# Cài đặt webhook listener
npm install -g webhook

# Tạo webhook config
cat > /etc/webhook.conf << 'EOF'
[
  {
    "id": "hanotex-deploy",
    "execute-command": "/usr/local/bin/deploy-hanotex.sh",
    "command-working-directory": "/var/www/hanotex",
    "response-message": "Deployment started",
    "trigger-rule": {
      "match": {
        "type": "payload-hash-sha1",
        "secret": "your-webhook-secret",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature"
        }
      }
    }
  }
]
EOF

# Start webhook service
webhook -hooks /etc/webhook.conf -verbose -port 9000
```

---

## 🧪 KIỂM TRA DEPLOYMENT

### 1. Health check

```bash
# Kiểm tra services
sudo systemctl status nginx
sudo systemctl status postgresql
sudo systemctl status redis-server
pm2 status

# Kiểm tra ports
netstat -tlnp | grep -E ':(80|443|3000|5432|6379)'

# Test database connection
sudo -u postgres psql -d hanotex_prod -c "SELECT COUNT(*) FROM users;"

# Test Redis
redis-cli -a your-redis-password ping

# Test web application
curl -I https://your-domain.com
curl https://your-domain.com/health
```

### 2. Performance testing

```bash
# Install Apache Bench
sudo apt install -y apache2-utils

# Test performance
ab -n 1000 -c 10 https://your-domain.com/
ab -n 100 -c 5 https://your-domain.com/api/technologies
```

---

## 🔧 XỬ LÝ SỰ CỐ PRODUCTION

### 1. Logs checking

```bash
# Application logs
pm2 logs
pm2 logs hanotex-web --lines 100

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
journalctl -u postgresql -f
```

### 2. Database issues

```bash
# PostgreSQL status
sudo systemctl status postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Database size
sudo -u postgres psql -d hanotex_prod -c "SELECT pg_size_pretty(pg_database_size('hanotex_prod'));"
```

### 3. Performance issues

```bash
# Check server resources
htop
df -h
free -m
iostat 1 5

# Check PM2 processes
pm2 monit

# Restart application
pm2 restart all
```

---

## 📋 CHECKLIST DEPLOYMENT

### Pre-deployment:
- [ ] Server setup hoàn tất
- [ ] Domain name pointing đúng IP
- [ ] SSL certificate đã cài đặt
- [ ] Database đã được tạo và import data
- [ ] Environment variables đã cấu hình
- [ ] Firewall rules đã setup
- [ ] Backup system đã setup

### Post-deployment:
- [ ] Health check pass
- [ ] SSL certificate hoạt động
- [ ] Database connection OK
- [ ] Authentication system hoạt động
- [ ] File upload hoạt động
- [ ] Email sending hoạt động (nếu có)
- [ ] Performance test OK
- [ ] Monitoring setup
- [ ] Backup test thành công

---

## 🚨 EMERGENCY PROCEDURES

### 1. Rollback deployment

```bash
# Stop current version
pm2 stop all

# Restore from backup
cd /var/www/hanotex
git checkout HEAD~1  # hoặc commit hash cụ thể

# Restore database
gunzip < /backup/hanotex/db_YYYYMMDD_HHMMSS.sql.gz | sudo -u postgres psql hanotex_prod

# Restart application
npm install
npm run build
pm2 start ecosystem.config.js
```

### 2. Database recovery

```bash
# Stop application
pm2 stop all

# Restore database
sudo systemctl stop postgresql
sudo -u postgres pg_dump hanotex_prod > /tmp/current_backup.sql
gunzip < /backup/hanotex/db_LATEST.sql.gz | sudo -u postgres psql hanotex_prod
sudo systemctl start postgresql

# Restart application
pm2 start all
```

### 3. Emergency contacts

```bash
# Server status notification
cat > /usr/local/bin/alert.sh << 'EOF'
#!/bin/bash
MESSAGE="HANOTEX Server Alert: $1"
# Setup email alerts or Slack notifications here
echo "$MESSAGE" | mail -s "Server Alert" admin@your-domain.com
EOF
chmod +x /usr/local/bin/alert.sh
```

---

## 📞 HỖ TRỢ VÀ TROUBLESHOOTING

### Common Issues:

1. **503 Service Unavailable**
   ```bash
   pm2 restart all
   sudo systemctl restart nginx
   ```

2. **Database connection failed**
   ```bash
   sudo systemctl restart postgresql
   # Check connection string in .env files
   ```

3. **SSL certificate expired**
   ```bash
   sudo certbot renew
   sudo systemctl reload nginx
   ```

4. **High memory usage**
   ```bash
   pm2 restart all
   # Consider increasing server RAM
   ```

5. **Disk space full**
   ```bash
   # Clean old logs
   sudo journalctl --vacuum-time=7d
   pm2 flush
   # Clean old backups
   find /backup -mtime +30 -delete
   ```

---

## 📄 CHANGELOG

### v1.0.0 (Initial Release)
- ✅ Ubuntu Server setup
- ✅ Docker deployment
- ✅ Nginx reverse proxy
- ✅ SSL/TLS configuration
- ✅ Database setup
- ✅ Security hardening
- ✅ Monitoring setup
- ✅ Backup system
- ✅ CI/CD pipeline

---

## 👥 LIÊN HỆ HỖ TRỢ

Khi cần hỗ trợ deployment:

- **Email**: devops@your-domain.com
- **Documentation**: https://docs.your-domain.com
- **Emergency**: +84-xxx-xxx-xxx

---

*Tài liệu này được cập nhật lần cuối: **17/09/2025***

*Phiên bản: **v1.0.0***

*Môi trường: **Ubuntu Server 20.04/22.04 LTS***