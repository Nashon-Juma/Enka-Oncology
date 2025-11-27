#!/bin/bash

echo "�� Setting up Cancer Care Platform..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Creating project structure..."
    
    # Create root package.json
    cat > package.json << 'ROOT_JSON'
{
  "name": "cancer-care-platform",
  "version": "1.0.0",
  "description": "A production-ready MERN stack web application for cancer patients and their care teams",
  "private": true,
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:backend": "cd apps/backend && npm run dev",
    "dev:frontend": "cd apps/frontend && npm run dev",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd apps/backend && npm run build",
    "build:frontend": "cd apps/frontend && npm run build",
    "docker:dev": "docker-compose -f docker/docker-compose.yml up --build"
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
ROOT_JSON

    # Create backend package.json
    mkdir -p apps/backend
    cat > apps/backend/package.json << 'BACKEND_JSON'
{
  "name": "cancer-care-backend",
  "version": "1.0.0",
  "main": "dist/app.js",
  "scripts": {
    "dev": "tsx watch src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.5.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.5.0",
    "tsx": "^3.12.7",
    "typescript": "^5.1.6"
  }
}
BACKEND_JSON

    # Create frontend package.json
    mkdir -p apps/frontend
    cat > apps/frontend/package.json << 'FRONTEND_JSON'
{
  "name": "cancer-care-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "13.5.2",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "axios": "^1.5.0"
  },
  "devDependencies": {
    "@types/react": "18.2.21",
    "@types/react-dom": "18.2.7",
    "@types/node": "20.5.1",
    "typescript": "5.1.6",
    "eslint": "8.47.0",
    "eslint-config-next": "13.5.2"
  }
}
FRONTEND_JSON

    # Create docker-compose
    mkdir -p docker
    cat > docker/docker-compose.yml << 'DOCKER_COMPOSE'
services:
  mongodb:
    image: mongo:7.0
    container_name: cancer-care-mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.backend
    container_name: cancer-care-backend
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/cancer-care
      - JWT_SECRET=dev-secret-key
    ports:
      - "3001:3001"
    depends_on:
      - mongodb
    volumes:
      - ../apps/backend:/app
      - /app/node_modules

  frontend:
    build:
      context: ..
      dockerfile: docker/Dockerfile.frontend
    container_name: cancer-care-frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
    ports:
      - "3000:3000"
    depends_on:
      - backend
    volumes:
      - ../apps/frontend:/app
      - /app/node_modules

volumes:
  mongodb_data:
DOCKER_COMPOSE

    # Create Dockerfiles
    cat > docker/Dockerfile.backend << 'DOCKER_BACKEND'
FROM node:18-alpine
WORKDIR /app
COPY apps/backend/package.json .
RUN npm install
COPY apps/backend/ .
EXPOSE 3001
CMD ["npm", "run", "dev"]
DOCKER_BACKEND

    cat > docker/Dockerfile.frontend << 'DOCKER_FRONTEND'
FROM node:18-alpine
WORKDIR /app
COPY apps/frontend/package.json .
RUN npm install
COPY apps/frontend/ .
EXPOSE 3000
CMD ["npm", "run", "dev"]
DOCKER_FRONTEND

    # Create environment file
    cat > .env.example << 'ENV_EXAMPLE'
MONGODB_URI=mongodb://localhost:27017/cancer-care
JWT_SECRET=dev-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3001
ENV_EXAMPLE

    cp .env.example .env
fi

echo "✅ Project structure created"

# Install dependencies
echo "�� Installing dependencies..."
npm install
cd apps/backend && npm install
cd ../frontend && npm install
cd ../..

echo "✅ Dependencies installed"

echo ""
echo "🎯 Next steps:"
echo "   1. Make sure Docker Desktop is running"
echo "   2. Run: npm run docker:dev"
echo "   3. Access the app at http://localhost:3000"
echo ""
