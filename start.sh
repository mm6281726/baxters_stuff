#!/bin/bash
set -e

# Wait for a few seconds to ensure everything is ready
sleep 5

# Run migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Load initial data if LOAD_INITIAL_DATA is set to true
if [ "$LOAD_INITIAL_DATA" = "true" ]; then
  echo "Loading initial data..."
  python manage.py loaddata initial_categories || echo "Failed to load initial data"
fi

# Download NLTK data
echo "Downloading NLTK data..."
python -m nltk.downloader -d $NLTK_DATA punkt stopwords averaged_perceptron_tagger

# Start Gunicorn
echo "Starting Gunicorn..."
exec gunicorn backend.wsgi -b 0.0.0.0:9090 -w 4 -n baxters_inventory
