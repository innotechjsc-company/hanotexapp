# Simple Dockerfile for Next.js CMS app
FROM node:20-alpine

# Install dependencies
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Enable pnpm
RUN corepack enable pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Expose port
EXPOSE 4000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000

# Start the application
CMD ["pnpm", "start"]
