# Docker Deployment Guide

## Prerequisites

- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2.0+

## Quick Start

```bash
# Clone repository
git clone <your-repo>
cd distance-calculator-app-OG

# Start all services
docker-compose up -d

# Check status
docker-compose ps

# Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Verify Services

```bash
# Backend health
curl http://localhost:8000/docs

# Frontend
curl http://localhost:3000

# PostgreSQL
docker-compose exec postgres psql -U postgres -c "\l"

# Redis
docker-compose exec redis redis-cli ping
```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart service
docker-compose restart backend

# Execute command in container
docker-compose exec backend python -c "print('Hello')"

# Clean up
docker-compose down -v
docker system prune -a
```

## Troubleshooting

### Port Already in Use

```bash
# Check what's using port 8000
netstat -ano | findstr :8000

# Change port in docker-compose.yml
ports:
  - "8001:8000"
```

### Database Connection Issues

```bash
# Check database logs
docker-compose logs postgres

# Recreate database
docker-compose down -v
docker-compose up -d postgres
```

## Production Deployment

```bash
# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Or set environment
export COMPOSE_FILE=docker-compose.prod.yml
docker-compose up -d
```
