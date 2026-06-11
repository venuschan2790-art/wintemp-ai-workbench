#!/bin/zsh

cd "$(dirname "$0")"

echo "WINTEMP AI Workbench"
echo "Project: $(pwd)"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js was not found."
  echo "Please install Node.js 20 LTS or later from: https://nodejs.org/"
  echo ""
  read "?Press Enter to close..."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm was not found."
  echo "Please install Node.js 20 LTS or later from: https://nodejs.org/"
  echo ""
  read "?Press Enter to close..."
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
  if [ $? -ne 0 ]; then
    echo ""
    echo "Dependency installation failed."
    read "?Press Enter to close..."
    exit 1
  fi
fi

echo ""
echo "Starting development server..."
echo "Open this exact address in Safari after the server is ready:"
echo "http://localhost:3000"
echo ""
echo "Do not use www.localhost.com:3000"
echo ""

npm run dev
