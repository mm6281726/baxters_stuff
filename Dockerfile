FROM node:20-alpine AS frontend-builder

# Set working directory for frontend
WORKDIR /frontend

# Copy frontend files
COPY frontend/ .

# Install dependencies and build frontend
RUN npm ci && npm run build

FROM python:3.13-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_ROOT_USER_ACTION=ignore \
    NLTK_DATA=/app/nltk_data

# Install system dependencies for OpenCV, Tesseract, Nginx, Supervisor, and utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    tesseract-ocr \
    nginx \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create app directories
WORKDIR /app

# Copy backend files
COPY backend/ /app/

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p /app/nltk_data /app/backend/instance /app/static /var/log/supervisor /app/backups

# Copy frontend build from the frontend-builder stage
COPY --from=frontend-builder /frontend/build /app/frontend/build

# Copy configuration files
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY start.sh /app/start.sh
COPY backup.sh /app/backup.sh
RUN chmod +x /app/start.sh /app/backup.sh

# Expose port 80
EXPOSE 80

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
