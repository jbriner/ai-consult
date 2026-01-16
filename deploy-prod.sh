#!/bin/bash

# Docker-based Production Deployment Script for AI Consult
# Target: DigitalOcean Droplet 146.190.38.177
# Domain: consult.247ignite.com

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="ai-consult"
DOMAIN="consult.247ignite.com"
SERVER_IP="146.190.38.177"
SERVER_USER="root"
APP_DIR="/root/ai-consult"
GITHUB_REPO="https://github.com/jbriner/ai-consult.git"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Deploy to Production server
deploy_to_production() {
    print_status "Deploying AI Consult to Production server..."

    # Step 1: Clone or pull code
    print_status "Setting up code on server..."
    ssh ${SERVER_USER}@${SERVER_IP} << EOF
        set -e

        # Check if directory exists
        if [ -d "${APP_DIR}" ]; then
            echo "📁 Directory exists, pulling latest code..."
            cd ${APP_DIR}
            git stash || echo "Nothing to stash"
            git pull origin main
        else
            echo "📁 Cloning repository..."
            git clone ${GITHUB_REPO} ${APP_DIR}
            cd ${APP_DIR}
        fi

        echo "📁 Creating directories for persistent data..."
        mkdir -p ${APP_DIR}/logs

        echo "📋 Copying production environment file..."
        # The .env.production should be in the repo or copied separately
EOF

    if [ $? -ne 0 ]; then
        print_error "Failed to setup code!"
        exit 1
    fi

    # Step 2: Copy .env.production file
    print_status "Copying production environment file..."
    scp .env.production ${SERVER_USER}@${SERVER_IP}:${APP_DIR}/.env.production

    # Step 3: Build and start Docker container
    print_status "Building and starting Docker container..."
    ssh -o ServerAliveInterval=60 -o ServerAliveCountMax=10 ${SERVER_USER}@${SERVER_IP} << EOF
        set -e
        cd ${APP_DIR}

        echo "🐳 Stopping existing container if running..."
        docker compose -f docker-compose.production.yml down || true

        echo "🔨 Building Docker image..."
        docker compose -f docker-compose.production.yml build --no-cache

        echo "🚀 Starting container..."
        docker compose -f docker-compose.production.yml up -d

        echo "⏳ Waiting for service to start..."
        sleep 15

        echo "🔍 Checking container status..."
        docker compose -f docker-compose.production.yml ps

        echo "🧪 Testing application response..."
        curl -s http://localhost:3000/health || echo "Health check pending..."
EOF

    if [ $? -eq 0 ]; then
        print_success "Deployment completed!"
        print_success "Site will be available at: https://${DOMAIN}"
        print_warning "Note: DNS must be configured to point ${DOMAIN} to ${SERVER_IP}"
    else
        print_error "Deployment failed!"
        exit 1
    fi
}

# Show status
show_status() {
    print_status "Checking deployment status..."
    ssh ${SERVER_USER}@${SERVER_IP} << EOF
        cd ${APP_DIR}
        echo "=== Container Status ==="
        docker compose -f docker-compose.production.yml ps

        echo ""
        echo "=== Recent Logs ==="
        docker compose -f docker-compose.production.yml logs --tail=20
EOF
}

# Show logs
show_logs() {
    ssh ${SERVER_USER}@${SERVER_IP} "cd ${APP_DIR} && docker compose -f docker-compose.production.yml logs --tail=50 -f"
}

# Main
case ${1:-deploy} in
    "deploy")
        print_status "🚀 Starting AI Consult Production deployment..."
        deploy_to_production
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    *)
        echo "Usage: $0 [deploy|status|logs]"
        exit 1
        ;;
esac
