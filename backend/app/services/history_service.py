import logging
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import QueryHistory

logger = logging.getLogger(__name__)

class HistoryService:
    """Service for managing query history"""
    
    @staticmethod
    def check_duplicate(db: Session, address1: str, address2: str) -> bool:
        """
        Check if query already exists (handles both directions)
        
        Args:
            db: Database session
            address1: Source address
            address2: Destination address
            
        Returns:
            True if duplicate exists, False otherwise
        """
        try:
            # Check forward direction
            forward = db.query(QueryHistory).filter(
                func.lower(QueryHistory.address1) == func.lower(address1),
                func.lower(QueryHistory.address2) == func.lower(address2)
            ).first()
            
            # Check reverse direction
            reverse = db.query(QueryHistory).filter(
                func.lower(QueryHistory.address1) == func.lower(address2),
                func.lower(QueryHistory.address2) == func.lower(address1)
            ).first()
            
            return forward is not None or reverse is not None
        except Exception as e:
            logger.error(f"Error checking duplicate: {str(e)}")
            return False
    
    @staticmethod
    def save_query(
        db: Session,
        address1: str,
        address2: str,
        distance_km: float,
        distance_miles: float
    ) -> dict:
        """
        Save query to database if not duplicate
        
        Args:
            db: Database session
            address1: Source address
            address2: Destination address
            distance_km: Distance in kilometers
            distance_miles: Distance in miles
            
        Returns:
            Status dictionary
        """
        try:
            if HistoryService.check_duplicate(db, address1, address2):
                logger.info(f"Duplicate query detected: {address1} -> {address2}")
                return {"status": "duplicate"}
            
            query = QueryHistory(
                address1=address1,
                address2=address2,
                distance_km=distance_km,
                distance_miles=distance_miles
            )
            db.add(query)
            db.commit()
            db.refresh(query)
            
            logger.info(f"Query saved: {address1} -> {address2}")
            return {"status": "success", "id": query.id}
        except Exception as e:
            db.rollback()
            logger.error(f"Error saving query: {str(e)}")
            return {"status": "error", "message": str(e)}
    
    @staticmethod
    def get_all_queries(db: Session, limit: int = 100) -> list:
        """
        Retrieve all queries sorted by most recent
        
        Args:
            db: Database session
            limit: Maximum number of queries to return
            
        Returns:
            List of query dictionaries
        """
        try:
            queries = db.query(QueryHistory).order_by(
                QueryHistory.created_at.desc()
            ).limit(limit).all()
            return [q.to_dict() for q in queries]
        except Exception as e:
            logger.error(f"Error retrieving queries: {str(e)}")
            return []
    
    @staticmethod
    def clear_all_queries(db: Session) -> bool:
        """
        Delete all queries from database
        
        Args:
            db: Database session
            
        Returns:
            True if successful, False otherwise
        """
        try:
            db.query(QueryHistory).delete()
            db.commit()
            logger.info("All queries cleared")
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"Error clearing queries: {str(e)}")
            return False