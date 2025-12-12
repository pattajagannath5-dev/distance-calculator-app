# Distance Calculator Backend

FastAPI-based REST API for calculating distances between addresses using geocoding.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run server
python -m uvicorn app.main:app --reload
```

Server: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

## Features

- 🗺️ **Geocoding** - Convert addresses to coordinates using Nominatim
- 📏 **Distance Calculation** - Calculate distances in km and miles
- 💾 **Query History** - Store and retrieve past calculations
- ⚡ **Redis Caching** - Cache geocoding results for faster responses
- ✅ **Input Validation** - Pydantic schemas for data validation

## Environment Setup

Create `.env` file:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/distance_calculator
REDIS_URL=redis://localhost:6379/0
CACHE_EXPIRE_SECONDS=3600
NOMINATIM_TIMEOUT=10
DEBUG=False
```

## API Endpoints

### Calculate Distance

```http
POST /api/distance/calculate
Content-Type: application/json

{
  "address1": "San Francisco, CA",
  "address2": "Palo Alto, CA"
}
```

**Response:**

```json
{
  "address1": "San Francisco, CA",
  "address2": "Palo Alto, CA",
  "distance_km": 48.5,
  "distance_miles": 30.1,
  "location1": { "latitude": 37.7749, "longitude": -122.4194 },
  "location2": { "latitude": 37.4419, "longitude": -122.143 }
}
```

### Get History

```http
GET /api/distance/history
```

### Clear History

```http
DELETE /api/distance/history/clear
```

### Clear Cache

```http
DELETE /api/distance/cache/clear
```

## Tech Stack

- **FastAPI** - Web framework
- **PostgreSQL** - Database
- **Redis** - Caching layer
- **SQLAlchemy** - ORM
- **Geopy** - Geocoding and distance calculations
- **Pydantic** - Data validation

## Project Structure

```
backend/
├── app/
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   │   ├── geocoding_service.py
│   │   ├── history_service.py
│   │   └── cache_service.py
│   ├── models.py        # Database models
│   ├── schemas.py       # Pydantic schemas
│   ├── database.py      # DB configuration
│   └── main.py          # FastAPI app
└── requirements.txt
```

## Development

```bash
# Install dev dependencies
pip install -r requirements.txt

# Run with auto-reload
python -m uvicorn app.main:app --reload

# Run tests
pytest
```

## Production

```bash
# Install gunicorn
pip install gunicorn

# Run with multiple workers
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Cache Management

```bash
# View Redis cache
redis-cli KEYS "distance:*"

# Clear Redis cache
redis-cli FLUSHDB
```

## License

MIT
