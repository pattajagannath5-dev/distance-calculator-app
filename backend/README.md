# Distance Calculator - Backend API

FastAPI-based REST API for calculating distances between addresses.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Database](#database)
- [Services](#services)
- [Error Handling](#error-handling)
- [Logging](#logging)

## 🚀 Quick Start

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python -m uvicorn app.main:app --reload
```

Server will be available at: `http://127.0.0.1:8000`

## ✨ Features

- **FastAPI Framework**: Modern, fast, and easy-to-use web framework
- **Geolocation Services**: Uses Nominatim for address geocoding
- **Distance Calculations**: Calculates great-circle distances
- **Query Persistence**: SQLite database for storing query history
- **CORS Support**: Enable cross-origin requests from frontend
- **Input Validation**: Pydantic schemas for request/response validation
- **Error Handling**: Comprehensive error messages and HTTP status codes
- **Logging**: Built-in logging for debugging and monitoring

## 🏗️ Architecture

### Layers

```
Routes (API Endpoints)
    ↓
Services (Business Logic)
    ↓
Database (Data Access)
```

### Files

- **`config.py`** - Configuration management
- **`database.py`** - Database initialization and session management
- **`models.py`** - SQLAlchemy ORM models
- **`schemas.py`** - Pydantic validation schemas
- **`main.py`** - FastAPI app setup and middleware
- **`routes/distance.py`** - API endpoints
- **`services/geocoding_service.py`** - Geocoding and distance calculation
- **`services/history_service.py`** - Database operations for history

## 📦 Installation

### Prerequisites

- Python 3.8+
- pip (Python package manager)

### Setup

1. **Create virtual environment**

   ```bash
   python -m venv venv
   ```

2. **Activate virtual environment**

   ```bash
   # Windows
   venv\Scripts\activate

   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file**
   ```env
   DATABASE_URL=sqlite:///./distance_calculator.db
   DEBUG=False
   NOMINATIM_TIMEOUT=10
   ```

## ⚙️ Configuration

### Environment Variables

**`.env` file:**

```env
# Database
DATABASE_URL=sqlite:///./distance_calculator.db

# Debug mode
DEBUG=False

# Geocoding timeout (seconds)
NOMINATIM_TIMEOUT=10
```

### Database Configuration

- **Default**: SQLite (file-based, no setup required)
- **Alternative**: PostgreSQL - update `DATABASE_URL` to:
  ```env
  DATABASE_URL=postgresql://user:password@localhost/distance_db
  ```

## 🎯 Running the Server

### Development Mode (with auto-reload)

```bash
python -m uvicorn app.main:app --reload
```

**Access:**

- Application: http://127.0.0.1:8000
- API Docs (Swagger): http://127.0.0.1:8000/docs
- Alternative Docs (ReDoc): http://127.0.0.1:8000/redoc

### Production Mode

```bash
pip install gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### Custom Port

```bash
python -m uvicorn app.main:app --reload --port 8001
```

## 📚 API Endpoints

### Health Check

#### GET `/`

Health check endpoint.

**Response:**

```json
{
  "message": "Distance Calculator API is running"
}
```

#### GET `/health`

Health status endpoint.

**Response:**

```json
{
  "status": "healthy"
}
```

### Distance Calculation

#### POST `/api/distance/calculate`

Calculate distance between two addresses.

**Request Body:**

```json
{
  "address1": "415 Mission St Suite 4800, San Francisco, CA 94105",
  "address2": "3223 Hanover St Suite 110, Palo Alto, CA 94304"
}
```

**Response (200 OK):**

```json
{
  "address1": "415 Mission St Suite 4800, San Francisco, CA 94105",
  "address2": "3223 Hanover St Suite 110, Palo Alto, CA 94304",
  "distance_km": 47.54,
  "distance_miles": 29.54,
  "location1": {
    "latitude": 37.7899,
    "longitude": -122.3971
  },
  "location2": {
    "latitude": 37.4419,
    "longitude": -122.143
  }
}
```

**Error (400 Bad Request):**

```json
{
  "detail": "Could not find address: invalid address"
}
```

### Query History

#### GET `/api/distance/history`

Retrieve all past distance calculations.

**Response:**

```json
{
  "queries": [
    {
      "id": 1,
      "address1": "415 Mission St Suite 4800, San Francisco, CA 94105",
      "address2": "3223 Hanover St Suite 110, Palo Alto, CA 94304",
      "distance_km": 47.54,
      "distance_miles": 29.54,
      "created_at": "2024-01-15T10:30:00.123456"
    }
  ]
}
```

#### DELETE `/api/distance/history/clear`

Clear all query history.

**Response:**

```json
{
  "message": "All queries cleared successfully"
}
```

## 🗄️ Database

### Models

#### QueryHistory

Stores distance calculation queries.

**Fields:**

- `id` (Integer) - Primary key
- `address1` (String) - Source address
- `address2` (String) - Destination address
- `distance_km` (Float) - Distance in kilometers
- `distance_miles` (Float) - Distance in miles
- `created_at` (DateTime) - Timestamp

**Example:**

```python
{
  "id": 1,
  "address1": "San Francisco, CA",
  "address2": "Palo Alto, CA",
  "distance_km": 47.54,
  "distance_miles": 29.54,
  "created_at": "2024-01-15T10:30:00.123456"
}
```

### Database Operations

**Initialize Database:**

```python
from app.database import Base, engine
Base.metadata.create_all(bind=engine)
```

**Query History:**

```python
from app.database import SessionLocal
from app.models import QueryHistory

db = SessionLocal()
queries = db.query(QueryHistory).all()
```

**Delete All Queries:**

```python
db.query(QueryHistory).delete()
db.commit()
```

## 🔧 Services

### GeocodingService

Handles address geocoding and distance calculations.

**Methods:**

- `geocode_address(address: str) -> dict | None`

  - Geocodes a single address
  - Returns latitude and longitude or None

- `calculate_distance(address1: str, address2: str) -> dict`
  - Calculates distance between two addresses
  - Returns complete distance data

**Usage:**

```python
from app.services.geocoding_service import geocoding_service

result = geocoding_service.calculate_distance(
    "San Francisco, CA",
    "Palo Alto, CA"
)
```

### HistoryService

Manages database operations for query history.

**Methods:**

- `check_duplicate(db: Session, address1: str, address2: str) -> bool`

  - Checks if query already exists (bidirectional)

- `save_query(db, address1, address2, distance_km, distance_miles) -> dict`

  - Saves new query to database if not duplicate

- `get_all_queries(db: Session, limit: int = 100) -> list`

  - Retrieves all queries sorted by most recent

- `clear_all_queries(db: Session) -> bool`
  - Deletes all queries from database

**Usage:**

```python
from app.services.history_service import HistoryService

HistoryService.save_query(db, "SF", "PA", 47.54, 29.54)
queries = HistoryService.get_all_queries(db)
```

## ⚠️ Error Handling

### HTTP Status Codes

- `200 OK` - Successful request
- `400 Bad Request` - Invalid input or address not found
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

### Error Response Format

```json
{
  "detail": "Error message describing the issue"
}
```

### Common Errors

**Invalid Address:**

```json
{
  "detail": "Could not find address: invalid address name"
}
```

**Same Address:**

```json
{
  "detail": "Source and destination addresses cannot be the same"
}
```

**Empty Field:**

```json
{
  "detail": "Address cannot be empty"
}
```

**Address Too Long:**

```json
{
  "detail": "Address is too long (max 500 characters)"
}
```

## 📝 Logging

Logging is configured in `main.py`:

```python
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Log Levels

- `DEBUG` - Detailed information for development
- `INFO` - General informational messages
- `WARNING` - Warning messages for potentially harmful situations
- `ERROR` - Error messages
- `CRITICAL` - Critical errors

### Example Log Output

```
2024-01-15 10:30:45,123 - app.services.geocoding_service - INFO - Geocoding address: San Francisco, CA
2024-01-15 10:30:46,456 - app.services.history_service - INFO - Query saved: SF -> PA
```

## 🚨 Troubleshooting

### Port 8000 Already in Use

```bash
# Find process using port
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process and restart
python -m uvicorn app.main:app --reload --port 8001
```

### Database Locked Error

```bash
# Delete database and restart
rm distance_calculator.db
# Then restart the server
```

### Module Not Found Error

```bash
# Reinstall dependencies
pip install -r requirements.txt
```

### Nominatim Timeout

The default timeout is 10 seconds. Increase in `.env`:

```env
NOMINATIM_TIMEOUT=20
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Geopy Documentation](https://geopy.readthedocs.io/)

---

**Version:** 1.0.0
**Last Updated:** January 2024
