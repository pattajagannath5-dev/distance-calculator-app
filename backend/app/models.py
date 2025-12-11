from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base

class QueryHistory(Base):
    """Model for storing distance calculation history"""
    __tablename__ = "query_history"

    id = Column(Integer, primary_key=True, index=True)
    address1 = Column(String(500), nullable=False, index=True)
    address2 = Column(String(500), nullable=False, index=True)
    distance_km = Column(Float, nullable=False)
    distance_miles = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def to_dict(self):
        """Convert model to dictionary"""
        return {
            "id": self.id,
            "address1": self.address1,
            "address2": self.address2,
            "distance_km": self.distance_km,
            "distance_miles": self.distance_miles,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }