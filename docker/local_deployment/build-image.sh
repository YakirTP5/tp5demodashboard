#!/bin/bash

# Get the directory of the current script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR/.." || exit

# Source the secret file to get the GitHub access token
source secret.sh

# Build the Docker image using Dockerfile from docker directory
if docker build \
    --build-arg GITHUB_ACCESS_TOKEN="$GITHUB_ACCESS_TOKEN" \
    -t tp5demodashboard_img:latest \
    -f Dockerfile .; then
    echo "Docker image built successfully"
else
    echo "Error: Docker image build failed"
    exit 1
fi 