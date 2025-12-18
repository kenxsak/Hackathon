# Multi-stage build for Otisium
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for frontend
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm install

# Copy frontend source
COPY . .

# Build frontend with environment variables
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_API_URL
ARG VITE_WEB3FORMS_KEY

ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WEB3FORMS_KEY=$VITE_WEB3FORMS_KEY

RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy server package files
COPY server/package*.json ./

# Install server dependencies
RUN npm ci --only=production

# Copy server code
COPY server/server.js ./

# Copy built frontend to public directory (server serves from public)
COPY --from=builder /app/dist ./public

# Expose port (Zeabur will use this)
EXPOSE 3001

# Set environment to production
ENV NODE_ENV=production

# Start the server (it will serve both API and static files)
CMD ["node", "server.js"]
