import redis
import json
from app.config import Config

class CacheService:
    def __init__(self):
        self.client = redis.from_url(
            Config.REDIS_URL,
            decode_responses=True
        )
    
    def create_distance_key(self, addr1: str, addr2: str) -> str:
        """Create bidirectional cache key"""
        normalized = sorted([addr1.lower().strip(), addr2.lower().strip()])
        return f"distance:{normalized[0]}:{normalized[1]}"
    
    def get_distance(self, addr1: str, addr2: str) -> dict | None:
        """Get cached distance result"""
        key = self.create_distance_key(addr1, addr2)
        cached = self.client.get(key)
        return json.loads(cached) if cached else None
    
    def set_distance(self, addr1: str, addr2: str, result: dict):
        """Cache distance result (24 hours)"""
        key = self.create_distance_key(addr1, addr2)
        self.client.setex(key, Config.CACHE_EXPIRE_SECONDS, json.dumps(result))
    
    def clear_all_distance_cache(self):
        """Clear all distance calculations"""
        pattern = "distance:*"
        keys = self.client.keys(pattern)
        if keys:
            self.client.delete(*keys)
        return len(keys)
    
    def clear_cache(self):
        """Clear entire cache (use with caution)"""
        self.client.flushdb()
    
    def delete_specific(self, addr1: str, addr2: str):
        """Delete specific cached distance"""
        key = self.create_distance_key(addr1, addr2)
        return self.client.delete(key)

cache_service = CacheService()