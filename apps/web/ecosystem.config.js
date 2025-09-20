module.exports = {
  apps: [
    {
      name: "hanotex-web",
      cwd: __dirname,
      script: "bun run dev",
      exec_mode: "cluster",
      instances: "max",
      env: {
        NODE_ENV: "production",

        NEXT_PUBLIC_API_URL: "http://localhost:3001/api/v1",
        NEXT_PUBLIC_APP_URL: "http://localhost:3000",
        NEXT_PUBLIC_WS_URL: "http://localhost:3001",

        NEXT_PUBLIC_PAYLOAD_API_URL: "http://localhost:4000/api",
      },
    },
  ],
};
