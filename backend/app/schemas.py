from pydantic import BaseModel, field_validator
from typing import List, Optional

class DistanceRequest(BaseModel):
    """Schema for distance calculation request"""
    address1: str
    address2: str
    
    @field_validator('address1', 'address2')
    @classmethod
    def validate_addresses(cls, v: str) -> str:
        """Validate address fields"""
        if not v or not v.strip():
            raise ValueError('Address cannot be empty')
        if len(v) > 500:
            raise ValueError('Address is too long (max 500 characters)')
        return v.strip()
    
    @field_validator('address2')
    @classmethod
    def validate_different_addresses(cls, v: str, info) -> str:
        """Validate that addresses are different"""
        if 'address1' in info.data:
            if v.strip().lower() == info.data['address1'].strip().lower():
                raise ValueError('Source and destination addresses cannot be the same')
        return v

class DistanceResponse(BaseModel):
    """Schema for distance calculation response"""
    address1: str
    address2: str
    distance_km: float
    distance_miles: float
    location1: dict
    location2: dict

class QueryHistory(BaseModel):
    id: int
    address1: str
    address2: str
    distance_km: float
    distance_miles: float
    timestamp: str

class QueryHistoryResponse(BaseModel):
    """Schema for query history response"""
    id: int
    address1: str
    address2: str
    distance_km: float
    distance_miles: float
    created_at: str