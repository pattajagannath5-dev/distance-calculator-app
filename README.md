# Distance Calculator

A full-stack web application for calculating distances between addresses using geocoding services.

## Features

- 🗺️ Calculate distances between two addresses (km/miles)
- 💾 Store and retrieve query history
- ⚡ Redis caching for faster responses
- 🔍 Address autocomplete from history
- 📱 Responsive design
- ✅ Input validation

## Tech Stack

**Backend:**

- FastAPI (Python)
- PostgreSQL + SQLAlchemy
- Redis (caching)
- Geopy (geocoding)

**Frontend:**

- React 18
- Axios
- CSS3

## Architecture

```
┌─────────────────┐
│   React App     │
│  (Port 3000)    │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   FastAPI       │
│  (Port 8000)    │
└────┬───────┬────┘
     │       │
     │       └──────► Redis Cache
     │                (Port 6379)
     │
     └──────────────► PostgreSQL DB
                      (Port 5432)
```

### Request Flow

```
1. User enters addresses in React form
2. Frontend sends POST to /api/distance/calculate
3. Backend checks Redis cache
   ├─ Cache HIT  → Return cached result (1ms)
   └─ Cache MISS →
       ├─ Geocode address1 (Nominatim API)
       ├─ Geocode address2 (Nominatim API)
       ├─ Calculate distance (geodesic)
       ├─ Save to PostgreSQL
       ├─ Cache in Redis (TTL: 1 hour)
       └─ Return result (2-3 seconds)
4. Frontend displays result
```

### Directory Structure

```
distance-calculator-app-OG/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   └── distance.py          # API endpoints
│   │   ├── services/
│   │   │   ├── geocoding_service.py # Distance calculation
│   │   │   ├── history_service.py   # Database operations
│   │   │   └── cache_service.py     # Redis operations
│   │   ├── models.py                # SQLAlchemy models
│   │   ├── schemas.py               # Pydantic validation
│   │   ├── database.py              # DB connection
│   │   ├── config.py                # Settings
│   │   └── main.py                  # FastAPI app
│   ├── .env
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── DistanceForm.js      # Input form
    │   │   ├── QueryHistory.js      # History table
    │   │   ├── Pagination.js        # Page controls
    │   │   └── SuggestionsList.js   # Autocomplete
    │   ├── hooks/
    │   │   ├── useDistanceCalculation.js
    │   │   └── useAddressSuggestions.js
    │   ├── services/
    │   │   └── api.js               # Axios client
    │   ├── pages/
    │   │   └── Home.js              # Main page
    │   └── App.js
    ├── .env
    └── package.json
```

### Database Schema

```sql
-- PostgreSQL
CREATE TABLE query_history (
    id SERIAL PRIMARY KEY,
    address1 VARCHAR(500) NOT NULL,
    address2 VARCHAR(500) NOT NULL,
    distance_km FLOAT NOT NULL,
    distance_miles FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_addresses ON query_history(address1, address2);
```

### Redis Cache Keys

```
Pattern: distance:{address1}:{address2}
Example: distance:palo alto:san francisco

Value: JSON string
{
  "address1": "San Francisco, CA",
  "address2": "Palo Alto, CA",
  "distance_km": 48.5,
  "distance_miles": 30.1,
  "location1": {"latitude": 37.7749, "longitude": -122.4194},
  "location2": {"latitude": 37.4419, "longitude": -122.1430}
}

TTL: 3600 seconds (1 hour)
```

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL 12+
- Redis 6+

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure .env
DATABASE_URL=postgresql://postgres:password@localhost:5432/distance_calculator
REDIS_URL=redis://localhost:6379/0
CACHE_EXPIRE_SECONDS=3600
NOMINATIM_TIMEOUT=10
DEBUG=False

# Run server
python -m uvicorn app.main:app --reload
```

Server: http://localhost:8000  
API Docs: http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure .env
REACT_APP_API_URL=http://127.0.0.1:8000/api/distance

# Run dev server
npm start
```

App: http://localhost:3000

### Database & Redis Setup

```bash
# PostgreSQL
createdb distance_calculator

# Redis (Windows - download from GitHub releases)
redis-server

# Redis (Mac)
brew install redis
brew services start redis

# Redis (Linux)
sudo apt-get install redis-server
sudo systemctl start redis
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

## Performance

- **Without Cache**: 2-3 seconds (2 geocoding API calls)
- **With Cache**: ~1ms (99.97% faster)
- **Cache Hit Rate**: ~60% for typical usage
- **Bidirectional Caching**: SF→PA and PA→SF share cache

## Development

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# View cache
redis-cli KEYS "distance:*"

# Monitor Redis
redis-cli MONITOR
```

## Production Deployment

```bash
# Backend
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker

# Frontend
npm run build
# Deploy build/ folder to hosting service
```

## License

MIT
