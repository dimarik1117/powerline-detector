from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisCreate, AnalysisUpdate, AnalysisResponse
from app.core.dependencies import get_current_user
from typing import List

router = APIRouter(prefix="/api/v1/analyses", tags=["analyses"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREATE
@router.post("/", response_model=AnalysisResponse)
def create_analysis(data: AnalysisCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    new_analysis = Analysis(
        image_path=data.image_path, 
        original_filename=data.original_filename,
        poles_number=data.poles_number, 
        processing_time=data.processing_time,
        bounding_boxes=data.bounding_boxes,
        user_id=user.id
    )
    
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)
    return new_analysis

# READ ALL
@router.get("/", response_model=List[AnalysisResponse])
def get_analyses(db: Session = Depends(get_db), user = Depends(get_current_user)):
    if user.role == "admin":
        return db.query(Analysis).all()

    return db.query(Analysis).filter(Analysis.user_id == user.id).all()

# READ ONE
@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    if user.role != "admin" and analysis.user_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    return analysis

# UPDATE
@router.put("/{analysis_id}", response_model=AnalysisResponse)
def update_analysis(analysis_id: int, data: AnalysisUpdate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Only admin can update analysis")

    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    if data.poles_number is not None:
        analysis.poles_number = data.poles_number

    if data.processing_time is not None:
        analysis.processing_time = data.processing_time

    db.commit()
    db.refresh(analysis)
    return analysis

# DELETE
@router.delete("/{analysis_id}")
def delete_analysis(analysis_id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    if user.role != "admin" and analysis.user_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    import os
    if os.path.exists(analysis.image_path):
        os.remove(analysis.image_path)
    
    db.delete(analysis)
    db.commit()
    return {"message": "Deleted successfully"}
