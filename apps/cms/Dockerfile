# Simple Dockerfile for Next.js CMS app with Bun
FROM oven/bun:1-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Expose port
EXPOSE 4000

# Start the application
CMD ["bun", "start"]
