from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.analysis import Analysis
from app.schemas.analysis import AnalysisCreate, AnalysisUpdate, AnalysisResponse
from typing import List

router = APIRouter(prefix="/api/v1/analyses", tags=["analyses"])

# Dependency для БД
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#CREATE
@router.post("/", response_model=AnalysisResponse)
def create_analysis(data: AnalysisCreate, db: Session = Depends(get_db)):
    new_analysis = Analysis(image_path=data.image_path, poles_number=data.poles_number, processing_time=data.processing_time)
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)
    return new_analysis

#READ ALL
@router.get("/", response_model=List[AnalysisResponse])
def get_analyses(db: Session = Depends(get_db)):
    return db.query(Analysis).all()

# READ ONE
@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return analysis

# UPDATE
@router.put("/{analysis_id}", response_model=AnalysisResponse)
def update_analysis(analysis_id: int, data: AnalysisUpdate, db: Session = Depends(get_db)):
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
def delete_analysis(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    db.delete(analysis)
    db.commit()
    return {"message": "Deleted successfully"}
