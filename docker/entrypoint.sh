#!/bin/sh

# Change to the application directory
cd $APP_DIR || exit

echo "Pulling the latest commit from the main branch..."
git fetch --depth 1 origin main && \
git reset --hard origin/main

# Install dependencies in case package.json has changed
npm ci --legacy-peer-deps

# Build the application
echo "Building the application..."
npm run build

# Ensure Nginx directories exist
mkdir -p /usr/share/nginx/html

# Copy new build to Nginx html directory
cp -r dist/* /usr/share/nginx/html/

# Copy the latest nginx configuration
echo "Updating Nginx configuration..."
cp docker/nginx.conf /etc/nginx/nginx.conf

# Start Nginx in foreground
echo "Starting Nginx..."
exec nginx -g 'daemon off;'