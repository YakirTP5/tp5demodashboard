# Use Node.js image as base
FROM node:20-alpine

# Install git and nginx
RUN apk add --no-cache git nginx

# Set working directory
WORKDIR /app

# Set environment variable for app directory
ENV APP_DIR=/app

# Clone the repository (initial clone)
RUN git clone https://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@github.com/YakirTP5/tp5demodashboard.git .

# Install dependencies
RUN npm ci --legacy-peer-deps

# Expose port 80
EXPOSE 80

# Add a dummy run command to invalidate the cache
RUN echo "Invalidate Cache 4"

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Use entrypoint script
ENTRYPOINT ["/entrypoint.sh"] 