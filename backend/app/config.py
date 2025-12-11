import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./distance_calculator.db")
    DEBUG = os.getenv("DEBUG", "False") == "True"
    NOMINATIM_TIMEOUT = 10
    RATE_LIMIT_DELAY = 1  # seconds between geocoding requests