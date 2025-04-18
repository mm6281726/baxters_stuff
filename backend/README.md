# Baxter's Stuff Backend

## Dependency Management

This project uses `pip-tools` to manage Python dependencies. This approach makes it easier to maintain consistent, reproducible builds.

### How it works

1. **requirements.in**: Contains the high-level dependencies without specific version pins
2. **requirements.txt**: Contains the exact pinned versions of all dependencies (including transitive ones)

### Adding new dependencies

1. Add the dependency to `requirements.in`
2. Run `pip-compile requirements.in` to update `requirements.txt`
3. Run `pip install -r requirements.txt` to install the new dependencies

### Updating dependencies

To update all dependencies to their latest versions:

```bash
# Activate the virtual environment
source ../.venv/bin/activate

# Update all dependencies
pip-compile --upgrade requirements.in

# Install the updated dependencies
pip install -r requirements.txt
```

To update a specific dependency:

```bash
# Activate the virtual environment
source ../.venv/bin/activate

# Update a specific package (e.g., Django)
pip-compile --upgrade-package django requirements.in

# Install the updated dependencies
pip install -r requirements.txt
```

### NLTK Data Management

NLTK data is not included in the git repository. The application will download the necessary NLTK data when it runs.

In development:
- NLTK data will be downloaded to the location specified by the `NLTK_DATA` environment variable
- If `NLTK_DATA` is not set, it will default to a directory within the project

In Docker:
- NLTK data is stored in a dedicated volume
- The `NLTK_DATA` environment variable is set to `/app/nltk_data` in the Dockerfile
