#!/bin/bash

# EmaCAre Platform - Local Development Setup Script

echo "🚀 EmaCAre Platform - Setup Script"
echo "=================================="

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18+"
    exit 1
fi
echo "✅ Node.js $(node -v)"

# Check Yarn
if ! command -v yarn &> /dev/null; then
    echo "⚠️  Yarn is not installed. Installing yarn..."
    npm install -g yarn
fi
echo "✅ Yarn $(yarn -v)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
yarn install

# Create .env file if not exists
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update with your configuration."
fi

# Check Docker
if command -v docker &> /dev/null; then
    echo "✅ Docker $(docker --version)"
else
    echo "⚠️  Docker is not installed. Docker Compose deployment not available."
fi

echo ""
echo "=================================="
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your configuration"
echo "2. Start services: yarn dev"
echo "3. Or with Docker: docker-compose up"
echo ""
echo "API Gateway will be available at: http://localhost:3000"
