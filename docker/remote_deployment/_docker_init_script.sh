#!/bin/bash

# This script sets up tp5sessionsdashboard as a standalone Dockerized app for a specific instance
# Exit immediately if a command exits with a non-zero status
set -e

# Get the directory of the current script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR" || exit

# ===========================
# Configuration Variables
# ===========================

# Path to the SSH key for accessing the target machine
SSH_KEY_PATH="$HOME/.ssh/id_rsa"

# SSH user and host
SSH_USER="ubuntu"
SSH_HOST="34.122.45.162"

# Local Docker files directory (relative to this script)
LOCAL_DOCKER_FILES_DIR="$SCRIPT_DIR/.."

# Remote directory for this specific project
REMOTE_PROJECT_DIR="/t5data/docker/tp5demodashboard_docker"

# ===========================
# Function Definitions
# ===========================

# Function to create project directory on the remote machine
create_remote_project_dir() {
    echo "Creating $REMOTE_PROJECT_DIR directory on the target machine..."
    ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "mkdir -p $REMOTE_PROJECT_DIR"
    echo "$REMOTE_PROJECT_DIR directory created successfully."
}

# Function to copy Docker files to the target machine
copy_docker_files() {
    echo "Copying Docker files to the target machine..."
    scp -i "$SSH_KEY_PATH" -r "${LOCAL_DOCKER_FILES_DIR}/Dockerfile" "$SSH_USER@$SSH_HOST:$REMOTE_PROJECT_DIR/"
    scp -i "$SSH_KEY_PATH" -r "${LOCAL_DOCKER_FILES_DIR}/entrypoint.sh" "$SSH_USER@$SSH_HOST:$REMOTE_PROJECT_DIR/"
    scp -i "$SSH_KEY_PATH" -r "${SCRIPT_DIR}/build_docker_image.sh" "$SSH_USER@$SSH_HOST:$REMOTE_PROJECT_DIR/"
    scp -i "$SSH_KEY_PATH" -r "${SCRIPT_DIR}/restart_container.sh" "$SSH_USER@$SSH_HOST:$REMOTE_PROJECT_DIR/"
    scp -i "$SSH_KEY_PATH" -r "${SCRIPT_DIR}/show_container_logs.sh" "$SSH_USER@$SSH_HOST:$REMOTE_PROJECT_DIR/"
    scp -i "$SSH_KEY_PATH" -r "${SCRIPT_DIR}/ssh_to_container.sh" "$SSH_USER@$SSH_HOST:$REMOTE_PROJECT_DIR/"
    echo "Docker files copied successfully."
}

# Function to set execution permissions on the target machine
set_permissions() {
    echo "Setting execution permissions on the target machine..."
    ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "cd $REMOTE_PROJECT_DIR && chmod +x *.sh"
    echo "Permissions set successfully."
}

# Function to execute deployment scripts on the target machine
execute_scripts() {
    echo "Building Docker image on the target machine..."
    ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "cd $REMOTE_PROJECT_DIR && ./build_docker_image.sh"

    echo "Initializing Docker container on the target machine..."
    ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "cd $REMOTE_PROJECT_DIR && ./restart_container.sh"

    echo "Deployment completed successfully."
}

# ===========================
# Execute Deployment Steps
# ===========================

create_remote_project_dir
copy_docker_files
set_permissions
execute_scripts 