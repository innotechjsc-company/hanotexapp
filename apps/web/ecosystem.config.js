module.exports = {
  apps: [
    {
      name: "hanotex-web",
      cwd: __dirname,
      script: "bun",
      args: "run dev",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "2G",
      time: true,
      env: {
        NODE_ENV: "production",
        PORT: 3000,

        NEXT_PUBLIC_API_URL: "http://localhost:3001/api/v1",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        NEXT_PUBLIC_WS_URL: "http://localhost:3001",

        NEXT_PUBLIC_PAYLOAD_API_URL: "http://34.142.238.176:4000/api",
      },
      env_development: {
        NODE_ENV: "development",
        PORT: 3000,

        NEXT_PUBLIC_API_URL: "http://localhost:3001/api/v1",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        NEXT_PUBLIC_WS_URL: "http://localhost:3001",

        NEXT_PUBLIC_PAYLOAD_API_URL: "http://34.142.238.176:4000/api",
      },
    },
  ],
};
