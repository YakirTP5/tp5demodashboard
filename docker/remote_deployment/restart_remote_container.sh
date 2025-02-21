#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Path to the SSH key for accessing the target machine
SSH_KEY_PATH="$HOME/.ssh/id_rsa"

# SSH user and host
SSH_USER="ubuntu"
SSH_HOST="34.122.45.162"

ssh -i "$SSH_KEY_PATH" "$SSH_USER@$SSH_HOST" "cd /t5data/docker/tp5demodashboard_docker && ./restart_container.sh"
