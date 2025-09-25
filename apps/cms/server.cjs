/**
 * Custom Next.js server with WebSocket support (CommonJS)
 * This file integrates Socket.IO with the Next.js application
 */

const { createServer } = require('http')
const { Server } = require('socket.io')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 4000

// Create Next.js app
const app = next({ dev, hostname, port })
const handler = app.getRequestHandler()

app.prepare().then(() => {
  const httpServer = createServer(handler)
  
  // Initialize Socket.IO
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  })

  // Socket.IO connection handling
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id)
    
    // Handle custom events here
    socket.on('message', (data) => {
      console.log('Received message:', data)
      // Broadcast to all clients or handle as needed
      io.emit('message', data)
    })
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })

  // Start server
  httpServer
    .once('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      console.log(`> Socket.IO server running`)
    })
}).catch((err) => {
  console.error('Error starting server:', err)
  process.exit(1)
})