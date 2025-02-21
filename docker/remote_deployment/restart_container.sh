#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# ===========================
# Configuration Variables
# ===========================

DOCKER_IMAGE_NAME="tp5demodashboard_img"
DOCKER_CONTAINER_NAME="tp5demodashboard"
NETWORK_NAME="tp5network"

echo "----------------------------------------"
echo "Starting Docker container restart process..."
echo "----------------------------------------"

# Check if network exists and create it if it doesn't
if ! docker network ls | grep -q "$NETWORK_NAME"; then
    echo "Creating network $NETWORK_NAME..."
    docker network create $NETWORK_NAME
else
    echo "Network $NETWORK_NAME already exists."
fi

# Check if the container exists and remove it
if docker ps -a --filter "name=^/${DOCKER_CONTAINER_NAME}$" --format "{{.Names}}" | grep -q "^${DOCKER_CONTAINER_NAME}$"; then
    echo "Stopping and removing existing container..."
    docker stop "$DOCKER_CONTAINER_NAME" || true
    docker rm "$DOCKER_CONTAINER_NAME" || true
fi

# Start the new container
echo "Starting new container..."
docker run -d \
    --name "$DOCKER_CONTAINER_NAME" \
    --network $NETWORK_NAME \
    -p 3002:80 \
    "$DOCKER_IMAGE_NAME"

echo "Container started successfully." 