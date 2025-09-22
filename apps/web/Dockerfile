# Development Dockerfile
FROM oven/bun:1-alpine

# Install system dependencies
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lock* ./

# Install all dependencies (including dev dependencies)
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun run build

# Expose port
EXPOSE 3000

# Start development server
CMD ["bun", "start"]