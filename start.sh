#!/bin/bash
set -e

echo "Installing dependencies..."
cd server
npm install

echo "Starting server..."
npm start

