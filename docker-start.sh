#!/bin/bash

# EmaCAre Platform - Quick Start for Docker Compose

echo "🐳 Starting EmaCAre Platform with Docker Compose..."
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker $(docker --version)"
echo "✅ Docker Compose $(docker-compose --version)"

# Create .env if not exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
fi

# Build and start services
echo ""
echo "🚀 Building and starting services..."
docker-compose up -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Show service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "=================================================="
echo "✅ Services are starting up!"
echo ""
echo "Access Points:"
echo "• API Gateway: http://localhost:3000/health"
echo "• MongoDB: mongodb://localhost:27017"
echo "• Redis: redis://localhost:6379"
echo ""
echo "View logs:"
echo "  docker-compose logs -f api-gateway"
echo ""
echo "Stop services:"
echo "  docker-compose down"
