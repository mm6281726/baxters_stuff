FROM python:3.9-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_ROOT_USER_ACTION=ignore \
    NLTK_DATA=/app/nltk_data

# Create a working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY requirements.txt /app/
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Create necessary directories
RUN mkdir -p /app/nltk_data /app/backend/instance

# Copy project files
COPY . /app/

# Expose port 9090
EXPOSE 9090

# Run the web service
CMD ["gunicorn", "backend.wsgi", "-b", "0.0.0.0:9090", "-w", "4", "-n", "baxters_inventory"]
