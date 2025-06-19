# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source files and .env file
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the application
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy the built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 