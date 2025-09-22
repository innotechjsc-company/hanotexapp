# Hướng dẫn sử dụng PM2 cho CMS Development

## Cài đặt PM2

Cài đặt PM2 globally:

```bash
npm install pm2 -g
```

## Các lệnh PM2 có sẵn

### Khởi động development server với PM2:

```bash
npm run pm2:dev
```

### Dừng PM2 process:

```bash
npm run pm2:stop
```

### Restart PM2 process:

```bash
npm run pm2:restart
```

### Reload PM2 process (zero downtime):

```bash
npm run pm2:reload
```

### Xóa PM2 process:

```bash
npm run pm2:delete
```

### Xem logs:

```bash
npm run pm2:logs
```

### Xem trạng thái các processes:

```bash
npm run pm2:status
```

### Mở monitoring dashboard:

```bash
npm run pm2:monit
```

## Cấu hình ecosystem.config.cjs

File `ecosystem.config.cjs` chứa các cấu hình sau:

- **name**: `cms-dev` - Tên của process
- **script**: `bun run dev` - Lệnh để chạy development server với Bun
- **watch**: `true` - Tự động restart khi file thay đổi
- **watch_delay**: `1000ms` - Độ trễ trước khi restart
- **ignore_watch**: Các folder/file được bỏ qua khi watch
- **env**: Các biến môi trường (NODE_ENV, PORT, NODE_OPTIONS)
- **max_restarts**: Giới hạn số lần restart (10 lần)
- **min_uptime**: Thời gian tối thiểu process phải chạy (10s)
- **max_memory_restart**: Restart khi RAM vượt quá 1GB
- **log_file**: Đường dẫn file log

## Logs

Các file log sẽ được lưu trong thư mục `logs/`:

- `logs/cms-dev.log` - Combined logs
- `logs/cms-dev-out.log` - Standard output logs
- `logs/cms-dev-error.log` - Error logs

## Lưu ý

1. PM2 sẽ tự động watch và restart khi có thay đổi code
2. Process sẽ restart tối đa 10 lần nếu có lỗi liên tục
3. Khi RAM sử dụng vượt quá 1GB, process sẽ tự restart
4. Port mặc định là 4000 (theo cấu hình Next.js)
5. Logs được merge và có timestamp để dễ debug

## Troubleshooting

### Xem chi tiết process:

```bash
pm2 show cms-dev
```

### Xem logs realtime:

```bash
pm2 logs cms-dev --lines 50
```

### Reset restart counter:

```bash
pm2 reset cms-dev
```

### Flush logs:

```bash
pm2 flush
```

### Save PM2 configuration (để auto startup sau khi reboot):

```bash
pm2 save
pm2 startup
```
