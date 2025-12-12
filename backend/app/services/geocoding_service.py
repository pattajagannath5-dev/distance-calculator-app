import logging
import time
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
from app.config import Config
from app.services.cache_service import cache_service

logger = logging.getLogger(__name__)

class GeocodingService:
    """Service for geocoding and distance calculations"""
    
    def __init__(self):
        self.locator = Nominatim(
            user_agent="distance_calculator",
            timeout=Config.NOMINATIM_TIMEOUT
        )
    
    def geocode_address(self, address: str) -> dict | None:
        """
        Geocode a single address
        
        Args:
            address: Address string to geocode
            
        Returns:
            Dictionary with latitude and longitude or None if not found
        """
        try:
            location = self.locator.geocode(address)
            if location:
                return {
                    "latitude": location.latitude,
                    "longitude": location.longitude
                }
            return None
        except (GeocoderTimedOut, GeocoderServiceError) as e:
            logger.error(f"Geocoding error for address '{address}': {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Unexpected geocoding error: {str(e)}")
            return None
    
    def calculate_distance(self, address1: str, address2: str) -> dict:
        """
        Calculate distance between two addresses
        
        Args:
            address1: Source address
            address2: Destination address
            
        Returns:
            Dictionary with distance and location data
        """
        # Check cache first (bidirectional)
        cached = cache_service.get_distance(address1, address2)
        if cached:
            logger.info(f"Cache hit: {address1} ↔ {address2}")
            return cached
        
        # Geocode first address
        location1 = self.geocode_address(address1)
        if not location1:
            return {"error": f"Could not find address: {address1}"}
        
        time.sleep(Config.RATE_LIMIT_DELAY)
        
        # Geocode second address
        location2 = self.geocode_address(address2)
        if not location2:
            return {"error": f"Could not find address: {address2}"}
        
        # Calculate distances
        coords1 = (location1["latitude"], location1["longitude"])
        coords2 = (location2["latitude"], location2["longitude"])
        
        distance_km = geodesic(coords1, coords2).kilometers
        distance_miles = geodesic(coords1, coords2).miles
        
        result = {
            "address1": address1,
            "address2": address2,
            "distance_km": round(distance_km, 2),
            "distance_miles": round(distance_miles, 2),
            "location1": location1,
            "location2": location2
        }
        
        # Cache the result
        cache_service.set_distance(address1, address2, result)
        return result

# Singleton instance
geocoding_service = GeocodingService()