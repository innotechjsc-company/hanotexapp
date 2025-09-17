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
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development

# Expose port
EXPOSE 3000

ENV PORT 3000

# Start development server
CMD ["bun", "run", "dev"]