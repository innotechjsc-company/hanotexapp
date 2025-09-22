export default {
  apps: [
    {
      name: 'cms-dev',
      script: 'bun run dev',
      watch: true,
      watch_delay: 1000,
      ignore_watch: ['node_modules', '.next', 'uploads', '.git', '*.log', '.env*'],
      env: {
        NODE_ENV: 'development',
        PORT: 4000,
        NODE_OPTIONS: '--no-deprecation',
      },
      // Restart configuration
      max_restarts: 10,
      min_uptime: '10s',
      // Logging
      log_file: './logs/cms-dev.log',
      out_file: './logs/cms-dev-out.log',
      error_file: './logs/cms-dev-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      // Memory and performance
      max_memory_restart: '1G',
      // Development specific settings
      instances: 1,
      exec_mode: 'fork',
      // Auto restart on file changes (watch mode)
      autorestart: true,
      // Kill timeout
      kill_timeout: 5000,
      // Wait time before restart
      restart_delay: 4000,
    },
  ],
}
