# 🚀 HANOTEX DEPLOYMENT SCRIPTS

Bộ script tự động deploy HANOTEX lên server Ubuntu Vultr với Cloudflare.

## 📁 CÁC SCRIPT CÓ SẴN

### 1. `setup-server.sh` - Setup hoàn chỉnh
**Sử dụng khi:** Lần đầu deploy hoặc setup server mới

**Tính năng:**
- ✅ Cài đặt tất cả dependencies (Node.js, Docker, Nginx, PM2)
- ✅ Clone repository và setup database
- ✅ Cấu hình Nginx với Cloudflare
- ✅ Setup SSL với Let's Encrypt
- ✅ Tạo monitoring và backup scripts
- ✅ Cấu hình firewall và security

### 2. `quick-deploy.sh` - Deploy nhanh
**Sử dụng khi:** Cần deploy nhanh cho testing

**Tính năng:**
- ✅ Setup cơ bản và deploy app
- ✅ Cấu hình Nginx đơn giản
- ✅ Không cần SSL (chạy trên HTTP)

### 3. `deploy-update.sh` - Cập nhật app
**Sử dụng khi:** Cập nhật code mới

**Tính năng:**
- ✅ Backup trước khi update
- ✅ Pull code mới từ git
- ✅ Build lại applications
- ✅ Restart services

## 🎯 HƯỚNG DẪN SỬ DỤNG

### Bước 1: Chuẩn bị Server Vultr

```bash
# 1. Tạo server Ubuntu 22.04 LTS
#    - CPU: 4 cores minimum
#    - RAM: 8GB minimum
#    - Storage: 100GB SSD

# 2. Kết nối SSH
ssh root@YOUR_SERVER_IP

# 3. Tạo user (khuyến nghị)
adduser hanotex
usermod -aG sudo hanotex
su - hanotex
```

### Bước 2: Download Scripts

```bash
# Tạo thư mục và download scripts
mkdir -p ~/deploy-scripts
cd ~/deploy-scripts

# Download từ GitHub hoặc copy từ local
wget https://raw.githubusercontent.com/your-repo/hanotex/main/deploy-scripts/setup-server.sh
wget https://raw.githubusercontent.com/your-repo/hanotex/main/deploy-scripts/quick-deploy.sh
wget https://raw.githubusercontent.com/your-repo/hanotex/main/deploy-scripts/deploy-update.sh

# Cấp quyền thực thi
chmod +x *.sh
```

### Bước 3: Chạy Script

#### Option A: Setup hoàn chỉnh (Khuyến nghị)
```bash
./setup-server.sh
```

Script sẽ hỏi:
- Domain name (ví dụ: hanotex.com)
- Server IP
- Database password
- NextAuth secret
- Payload secret

#### Option B: Quick deploy (Cho testing)
```bash
./quick-deploy.sh
```

#### Option C: Cập nhật app
```bash
./deploy-update.sh
```

## 🔧 SAU KHI DEPLOY

### Kiểm tra trạng thái
```bash
# Check PM2 processes
pm2 status

# Check logs
pm2 logs

# Check website
curl -I https://yourdomain.com

# Monitor system
/usr/local/bin/hanotex-monitor.sh
```

### Quản lý services
```bash
# Restart applications
pm2 restart all

# Stop applications
pm2 stop all

# View logs
pm2 logs hanotex-web
pm2 logs hanotex-cms

# Monitor resources
pm2 monit
```

### Backup và restore
```bash
# Manual backup
/usr/local/bin/hanotex-backup.sh

# Restore database
gunzip < /backup/hanotex/db_YYYYMMDD_HHMMSS.sql.gz | docker exec -i hanotex-postgres-prod psql -U postgres -d hanotex-dev
```

## 🌐 CẤU HÌNH CLOUDFLARE

### DNS Settings
```
Type: A
Name: @
Content: YOUR_SERVER_IP

Type: A  
Name: www
Content: YOUR_SERVER_IP

Type: CNAME
Name: api
Content: YOUR_SERVER_IP
```

### SSL/TLS Settings
- Encryption mode: **Full (strict)**
- Always Use HTTPS: **ON**
- HTTP Strict Transport Security (HSTS): **ON**

### Page Rules
```
URL: yourdomain.com/_next/static/*
Settings: Cache Level = Cache Everything, Edge Cache TTL = 1 month

URL: yourdomain.com/images/*  
Settings: Cache Level = Cache Everything, Edge Cache TTL = 1 month

URL: yourdomain.com/api/*
Settings: Cache Level = Bypass

URL: yourdomain.com/admin/*
Settings: Cache Level = Bypass
```

## 📊 MONITORING

### Health Check URLs
- Website: `https://yourdomain.com`
- API: `https://yourdomain.com/api/technologies`
- Admin: `https://yourdomain.com/admin`
- Health: `https://yourdomain.com/health`

### Log Files
- Application logs: `/var/www/hanotex/logs/`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -u nginx`
- PM2 logs: `pm2 logs`

### Monitoring Script
```bash
# Run monitoring
/usr/local/bin/hanotex-monitor.sh

# Setup cron job (already done by setup script)
*/5 * * * * /usr/local/bin/hanotex-monitor.sh >> /var/log/hanotex-monitor.log 2>&1
```

## 🚨 TROUBLESHOOTING

### Common Issues

#### 1. Website không load
```bash
# Check PM2 status
pm2 status

# Check Nginx
sudo systemctl status nginx
sudo nginx -t

# Check logs
pm2 logs
sudo tail -f /var/log/nginx/error.log
```

#### 2. Database connection failed
```bash
# Check Docker containers
docker ps

# Check database logs
docker logs hanotex-postgres-prod

# Restart database
docker restart hanotex-postgres-prod
```

#### 3. SSL certificate issues
```bash
# Renew certificate
sudo certbot renew

# Check certificate
sudo certbot certificates

# Reload Nginx
sudo systemctl reload nginx
```

#### 4. High memory usage
```bash
# Check memory usage
free -h
htop

# Restart applications
pm2 restart all

# Check PM2 memory limits
pm2 show hanotex-web
```

### Emergency Procedures

#### Rollback deployment
```bash
# Stop current version
pm2 stop all

# Restore from backup
cd /var/www/hanotex
git checkout HEAD~1

# Restore database
gunzip < /backup/hanotex/db_LATEST.sql.gz | docker exec -i hanotex-postgres-prod psql -U postgres -d hanotex-dev

# Restart
pm2 restart all
```

#### Complete reset
```bash
# Stop all services
pm2 stop all
docker compose -f docker-compose.prod.yml down

# Remove application
sudo rm -rf /var/www/hanotex

# Run setup script again
./setup-server.sh
```

## 📞 SUPPORT

Nếu gặp vấn đề:

1. **Check logs**: `pm2 logs` và `/var/log/nginx/error.log`
2. **Run monitoring**: `/usr/local/bin/hanotex-monitor.sh`
3. **Check system resources**: `htop`, `df -h`, `free -h`
4. **Verify services**: `pm2 status`, `docker ps`, `sudo systemctl status nginx`

## 🔄 UPDATES

Để cập nhật scripts:
```bash
cd ~/deploy-scripts
wget -O setup-server.sh https://raw.githubusercontent.com/your-repo/hanotex/main/deploy-scripts/setup-server.sh
wget -O quick-deploy.sh https://raw.githubusercontent.com/your-repo/hanotex/main/deploy-scripts/quick-deploy.sh
wget -O deploy-update.sh https://raw.githubusercontent.com/your-repo/hanotex/main/deploy-scripts/deploy-update.sh
chmod +x *.sh
```

---

**📝 Lưu ý:** Scripts này được thiết kế để chạy trên Ubuntu 22.04 LTS với quyền sudo. Đảm bảo bạn đã backup dữ liệu quan trọng trước khi chạy.
