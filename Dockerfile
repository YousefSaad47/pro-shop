# Stage 1: Build the frontend using Alpine
FROM node:18-alpine AS frontend-build

# Set working directory for the frontend
WORKDIR /app/frontend

# Install dependencies for the frontend
COPY frontend/package.json ./
RUN npm install --no-package-lock

# Copy the frontend source files
COPY frontend/ ./

# Build the frontend for production
RUN npm run build

# Stage 2: Build and run the backend using Alpine
FROM node:18-alpine AS backend

# Set working directory for the backend
WORKDIR /app/backend

# Install dependencies for the backend
COPY backend/package.json ./
RUN npm install --no-package-lock

# Copy backend source files
COPY backend/ ./

# Copy the built frontend from the first stage
COPY --from=frontend-build /app/frontend/dist ./public/web

# Expose the backend server port (if applicable)
EXPOSE 8080

# Start the backend server
CMD ["node", "server.js"]
