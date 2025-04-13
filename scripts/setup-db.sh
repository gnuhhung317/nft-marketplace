#!/bin/bash

# Khởi động PostgreSQL container
echo "Starting PostgreSQL container..."
docker-compose up -d

# Đợi PostgreSQL khởi động
echo "Waiting for PostgreSQL to start..."
sleep 10

# Chạy Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate dev

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Database setup completed!" 