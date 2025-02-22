# Use Node.js image as base
FROM node:20-alpine

# Install git and nginx
RUN apk add --no-cache git nginx

# Set working directory
WORKDIR /app

# Set environment variable for app directory
ENV APP_DIR=/app

# Accept build argument and set it as environment variable
ARG GITHUB_ACCESS_TOKEN
ENV GITHUB_ACCESS_TOKEN=$GITHUB_ACCESS_TOKEN

# Clone the repository (initial clone) using the token
RUN git clone https://${GITHUB_ACCESS_TOKEN}@github.com/YakirTP5/tp5demodashboard.git .

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