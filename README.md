# Baxter's Stuff

A comprehensive inventory management system for groceries, pantry items, and recipes.

## Development Setup

### Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - On Windows: `.venv\Scripts\activate`
   - On macOS/Linux: `source .venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file based on `.env.example`

6. Run migrations:
   ```
   python manage.py migrate
   ```

7. Start the development server:
   ```
   python manage.py runserver 9090
   ```

### Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example`

4. Start the development server:
   ```
   npm start
   ```

## Docker Deployment

### Prerequisites

- Docker and Docker Compose installed on your system

### Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/baxters_stuff.git
   cd baxters_stuff
   ```

2. Create environment files:
   ```
   cp backend/.env.example backend/.env
   ```

3. Edit the `.env` file with your configuration

### Build and Run

1. Build and start the container:
   ```
   docker-compose up -d --build
   ```

   The following tasks will run automatically when the container starts:
   - Database migrations
   - NLTK data downloads
   - Loading initial category data (if LOAD_INITIAL_DATA=true)

### Access the Application

- Application: http://localhost:8080
- Backend API: http://localhost:8080/api

### Stopping the Application

```
docker-compose down
```

### Viewing Logs

```
docker-compose logs -f
```

### Database Backups

The application automatically creates daily backups of the database. To manually trigger a backup:

```
docker-compose exec baxters_stuff /app/backup.sh
```

Backups are stored in the `/app/backups` directory inside the container. To copy a backup to your host system:

```
docker cp baxters_stuff:/app/backups/your_backup_file.sqlite3.gz ./
```

Only the 5 most recent backups are kept to save space.

## Features

- Grocery list management
- Pantry inventory tracking
- Recipe management and scanning
- Unit conversion system
- Category organization
