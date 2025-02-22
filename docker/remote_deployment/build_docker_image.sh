#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# ===========================
# Function Definitions
# ===========================

# Function to install Docker on Ubuntu
install_docker() {
    echo "Docker is not installed. Installing Docker..."
    sudo apt-get update -y
    sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io
    sudo usermod -aG docker "$USER"
    echo "Docker installed successfully."
}

# Function to check if Docker is installed
check_and_install_docker() {
    if ! command -v docker &> /dev/null; then
        install_docker
    else
        echo "Docker is already installed."
    fi
}

# Function to check if Docker daemon is running
check_docker_running() {
    if ! sudo systemctl is-active --quiet docker; then
        echo "Docker daemon is not running. Starting Docker..."
        sudo systemctl start docker
        echo "Docker daemon started."
    else
        echo "Docker daemon is running."
    fi
}

# ===========================
# Configuration Variables
# ===========================

DOCKER_IMAGE_NAME="tp5demodashboard_img"

# ===========================
# Build Process
# ===========================

echo "----------------------------------------"
echo "Performing pre-build setup..."
echo "----------------------------------------"

check_and_install_docker
check_docker_running

cd "$REMOTE_PROJECT_DIR"
docker build \
    --build-arg GITHUB_ACCESS_TOKEN="$GITHUB_ACCESS_TOKEN" \
    -t "$DOCKER_IMAGE_NAME" \
    -f Dockerfile .

echo "Docker image '$DOCKER_IMAGE_NAME' built successfully." 