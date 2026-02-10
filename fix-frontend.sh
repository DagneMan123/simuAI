#!/bin/bash

echo "========================================"
echo "   Fixing Frontend Dependencies"
echo "========================================"
echo ""

cd frontend

echo "Removing node_modules and package-lock.json..."
rm -rf node_modules package-lock.json

echo ""
echo "Installing dependencies with Tailwind CSS v4..."
npm install

echo ""
echo "========================================"
echo "   Fix Complete!"
echo "========================================"
echo ""
echo "Starting dev server..."
npm run dev
