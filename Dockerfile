# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Vite inlines VITE_* at build time – pass as build args
ARG VITE_API_URL
ARG VITE_TURNSTILE_PUB_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_TURNSTILE_PUB_KEY=$VITE_TURNSTILE_PUB_KEY

# Build the application
RUN yarn build

# Production stage
FROM nginx:stable

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
