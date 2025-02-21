#!/bin/bash

CONTAINER_NAME="tp5demodashboard"
NETWORK_NAME="tp5network"

# Create network if it doesn't exist
docker network create $NETWORK_NAME || true

# Stop and remove the previous container if it exists
docker stop $CONTAINER_NAME || true
docker rm $CONTAINER_NAME || true

# Start the container
docker run -d \
  --name $CONTAINER_NAME \
  --network $NETWORK_NAME \
  -p 3002:80 \
  tp5demodashboard_img

echo "Container started successfully" 