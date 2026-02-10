#!/bin/bash

# SimuAI Setup Script
# This script automates the setup process for the SimuAI platform

set -e

echo "=================================="
echo "   SimuAI Setup Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}Warning: PostgreSQL is not detected${NC}"
    echo "Please ensure PostgreSQL 14+ is installed and running"
fi

echo ""
echo "=================================="
echo "   Backend Setup"
echo "=================================="
echo ""

cd backend

# Install backend dependencies
echo "Installing backend dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
DATABASE_URL="postgresql://simuai:password@localhost:5432/simuai"
JWT_SECRET="$(openssl rand -base64 32)"
JWT_REFRESH_SECRET="$(openssl rand -base64 32)"
GROQ_API_KEY="your-groq-api-key"
FRONTEND_URL="http://localhost:3000"
PORT=5000
NODE_ENV="development"
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
    echo -e "${YELLOW}⚠ Please update DATABASE_URL and GROQ_API_KEY in backend/.env${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Setup database
echo ""
echo "Setting up database..."
read -p "Do you want to run database migrations? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx prisma generate
    npx prisma migrate dev --name init
    echo -e "${GREEN}✓ Database setup complete${NC}"
fi

cd ..

echo ""
echo "=================================="
echo "   Frontend Setup"
echo "=================================="
echo ""

cd frontend

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=SimuAI
VITE_APP_DESCRIPTION=AI-Powered Talent Assessment Platform
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

cd ..

echo ""
echo "=================================="
echo "   Setup Complete!"
echo "=================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "2. Start the frontend (in a new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open your browser:"
echo "   http://localhost:3000"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
