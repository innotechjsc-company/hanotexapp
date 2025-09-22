# 🚀 Hướng dẫn chạy PM2 với ecosystem.config.js

## 📋 Yêu cầu trước khi bắt đầu

1. **Cài đặt PM2 globally:**

   ```bash
   npm install pm2 -g
   ```

2. **Kiểm tra PM2 đã cài đặt:**
   ```bash
   pm2 --version
   ```

## 🎯 Các lệnh PM2 chính

### 1. Khởi động Development Server

```bash
# Cách 1: Sử dụng npm script (Khuyến nghị)
npm run pm2:dev

# Cách 2: Chạy trực tiếp PM2
pm2 start ecosystem.config.js --env development
```

### 2. Quản lý Process

```bash
# Xem trạng thái tất cả processes
npm run pm2:status

# Dừng process
npm run pm2:stop

# Restart process (hard restart)
npm run pm2:restart

# Reload process (zero downtime restart)
npm run pm2:reload

# Xóa process khỏi PM2 list
npm run pm2:delete
```

### 3. Monitoring & Logs

```bash
# Xem logs realtime
npm run pm2:logs

# Mở PM2 monitoring dashboard
npm run pm2:monit

# Xem logs với số dòng cụ thể
pm2 logs cms-dev --lines 50
```

## 🔧 File Cấu hình ecosystem.config.cjs

```javascript
module.exports = {
  apps: [
    {
      name: 'cms-dev', // Tên process
      script: 'bun', // Binary để chạy
      args: 'run dev', // Arguments cho binary
      watch: true, // Auto restart khi file thay đổi
      watch_delay: 1000, // Delay 1s trước khi restart
      ignore_watch: [
        // Bỏ qua các folder/file
        'node_modules',
        '.next',
        'uploads',
        '.git',
        '*.log',
        '.env*',
      ],
      env: {
        NODE_ENV: 'development', // Environment
        PORT: 4000, // Port server
        NODE_OPTIONS: '--no-deprecation', // Node options
      },
      max_restarts: 10, // Giới hạn restart
      min_uptime: '10s', // Uptime tối thiểu
      max_memory_restart: '1G', // Restart khi RAM > 1GB
      instances: 1, // Số instance
      exec_mode: 'fork', // Fork mode
      autorestart: true, // Auto restart
      kill_timeout: 5000, // Timeout kill process
      restart_delay: 4000, // Delay giữa các restart

      // Logging
      log_file: './logs/cms-dev.log',
      out_file: './logs/cms-dev-out.log',
      error_file: './logs/cms-dev-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
}
```

## 📝 Workflow thường dùng

### Khởi động lần đầu:

```bash
# 1. Khởi động PM2
npm run pm2:dev

# 2. Kiểm tra status
npm run pm2:status

# 3. Xem logs để đảm bảo chạy OK
npm run pm2:logs
```

### Khi phát triển:

```bash
# PM2 sẽ tự động restart khi bạn thay đổi code
# Nếu cần restart manual:
npm run pm2:restart

# Xem logs khi có lỗi:
npm run pm2:logs
```

### Khi kết thúc:

```bash
# Dừng process
npm run pm2:stop

# Hoặc xóa hoàn toàn
npm run pm2:delete
```

## 🛠 Troubleshooting

### Lỗi Port đã sử dụng:

```bash
# Tìm process sử dụng port 4000
lsof -ti:4000

# Kill process
kill -9 <PID>

# Restart PM2
npm run pm2:restart
```

### Xem chi tiết process:

```bash
pm2 show cms-dev
```

### Reset restart counter:

```bash
pm2 reset cms-dev
```

### Xóa tất cả logs:

```bash
pm2 flush
```

### Lưu cấu hình PM2 (auto startup sau reboot):

```bash
pm2 save
pm2 startup
```

## 📊 Monitoring Dashboard

Chạy lệnh sau để mở dashboard monitoring:

```bash
npm run pm2:monit
```

Dashboard hiển thị:

- CPU usage
- Memory usage
- Restart count
- Uptime
- Logs realtime

## 🎯 Server Information

Sau khi chạy thành công, server sẽ có sẵn tại:

- **Local**: http://localhost:4000
- **Network**: http://[YOUR_IP]:4000

## 💡 Tips & Best Practices

1. **Luôn check status trước khi restart:**

   ```bash
   npm run pm2:status
   ```

2. **Sử dụng reload thay vì restart cho zero-downtime:**

   ```bash
   npm run pm2:reload
   ```

3. **Monitor memory usage thường xuyên:**

   ```bash
   npm run pm2:monit
   ```

4. **Backup logs quan trọng trước khi flush:**

   ```bash
   cp logs/cms-dev.log logs/backup-$(date +%Y%m%d).log
   ```

5. **Check logs khi có vấn đề:**
   ```bash
   npm run pm2:logs
   ```
