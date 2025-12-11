import logging
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import DistanceRequest, DistanceResponse
from app.services.geocoding_service import geocoding_service
from app.services.history_service import HistoryService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/distance", tags=["distance"])

@router.post("/calculate", response_model=DistanceResponse)
async def calculate_distance(
    request: DistanceRequest,
    db: Session = Depends(get_db)
):
    """
    Calculate distance between two addresses
    
    Args:
        request: Distance request with two addresses
        db: Database session
        
    Returns:
        Distance calculation result
    """
    try:
        # Calculate distance using geocoding service
        result = geocoding_service.calculate_distance(request.address1, request.address2)
        
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        # Save to database
        HistoryService.save_query(
            db,
            request.address1,
            request.address2,
            result["distance_km"],
            result["distance_miles"]
        )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error calculating distance: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/history")
async def get_history(db: Session = Depends(get_db)):
    """
    Retrieve all past distance calculations
    
    Args:
        db: Database session
        
    Returns:
        List of query history
    """
    try:
        queries = HistoryService.get_all_queries(db)
        return {"queries": queries}
    except Exception as e:
        logger.error(f"Error retrieving history: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.delete("/history/clear")
async def clear_history(db: Session = Depends(get_db)):
    """
    Clear all query history
    
    Args:
        db: Database session
        
    Returns:
        Success message
    """
    try:
        success = HistoryService.clear_all_queries(db)
        if success:
            return {"message": "All queries cleared successfully"}
        raise HTTPException(status_code=500, detail="Error clearing history")
    except Exception as e:
        logger.error(f"Error clearing history: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")