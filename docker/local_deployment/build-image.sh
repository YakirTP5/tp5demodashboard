#!/bin/bash

# Get the directory of the current script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR/.." || exit

# Build the Docker image using Dockerfile from docker directory
if docker build -t tp5demodashboard_img:latest -f Dockerfile .; then
    echo "Docker image built successfully"
else
    echo "Error: Docker image build failed"
    exit 1
fi 