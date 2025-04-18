#!/bin/bash
set -e

# Create backup directory if it doesn't exist
mkdir -p /app/backups

# Generate timestamp for the backup filename
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="/app/backups/baxters_stuff_backup_${TIMESTAMP}.sqlite3"

# Create a backup of the SQLite database
echo "Creating database backup: ${BACKUP_FILE}"
cp /app/backend/instance/db.sqlite3 "${BACKUP_FILE}"

# Compress the backup
echo "Compressing backup..."
gzip "${BACKUP_FILE}"

# List all backups
echo "Available backups:"
ls -lh /app/backups/

# Keep only the 5 most recent backups
echo "Cleaning up old backups..."
ls -t /app/backups/ | tail -n +6 | xargs -I {} rm -f "/app/backups/{}"

echo "Backup completed: ${BACKUP_FILE}.gz"
