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

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
ENV NEXT_PUBLIC_APP_URL=http://localhost:3000
ENV NEXT_PUBLIC_WS_URL=http://localhost:3001
ENV NEXT_PUBLIC_PAYLOAD_API_URL=http://localhost:4000/api

# Expose port
EXPOSE 3000

ENV PORT 3000

# Start development server
CMD ["bun", "start"]