/**
 * Custom Next.js server with WebSocket support (CommonJS)
 * This file integrates Socket.IO with the Next.js application
 */

const { createServer } = require('http')
const next = require('next')

// Dynamic import for ES modules
let ChatWebSocketServer

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 4000
const hostname = dev ? 'localhost' : '0.0.0.0' // Listen on all interfaces in production

const domain = dev ? `http://localhost:${port}` : 'https://api.hanotex.vn'

// Create Next.js app
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

async function startServer() {
  try {
    // Dynamic import for ES modules
    const webSocketModule = await import('./src/websocket/server.js')
    ChatWebSocketServer = webSocketModule.ChatWebSocketServer

    await app.prepare()

    const httpServer = createServer(handler)

    // Initialize our custom WebSocket server
    const webSocketServer = new ChatWebSocketServer(httpServer)
    console.log('🚀 Chat WebSocket server initialized')

    // Start server
    httpServer
      .once('error', (err) => {
        console.error('❌ Server error:', err)
        process.exit(1)
      })
      .listen(port, () => {
        console.log(`🚀 Server ready on ${domain}`)
        console.log(`🔌 WebSocket server ready on ${domain.replace('http', 'ws')}/socket.io/`)
      })
  } catch (err) {
    console.error('❌ Error starting server:', err)
    process.exit(1)
  }
}

startServer()
