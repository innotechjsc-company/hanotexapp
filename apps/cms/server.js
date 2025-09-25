/**
 * Custom Next.js server with WebSocket support
 * This file integrates Socket.IO with the Next.js application
 */

import { createServer } from 'http'
import next from 'next'
import { initializeChatWebSocket } from './src/websocket/server.js'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 4000

// Create Next.js app
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  // Create HTTP server
  const httpServer = createServer(handler)

  // Initialize WebSocket server
  const chatWebSocket = initializeChatWebSocket(httpServer)

  // Start the server
  httpServer
    .once('error', (err) => {
      console.error('❌ Server error:', err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`🚀 Server ready on http://${hostname}:${port}`)
      console.log(`🔌 WebSocket server ready on ws://${hostname}:${port}/socket.io/`)
    })

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully')
    httpServer.close(() => {
      console.log('✅ Server closed')
      process.exit(0)
    })
  })

  process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully')
    httpServer.close(() => {
      console.log('✅ Server closed')
      process.exit(0)
    })
  })
})
