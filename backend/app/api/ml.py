from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import JSONResponse, Response
from sqlalchemy.orm import Session
import os
import uuid
from datetime import datetime

from app.db.database import SessionLocal
from app.core.dependencies import get_current_user
from app.models.analysis import Analysis
from app.models.user import User
from app.ml.model import model
from app.schemas.ml import DetectionResult, BoundingBox, DetectionResponse
from app.schemas.analysis import AnalysisResponse

router = APIRouter(prefix="/api/v1/ml", tags=["ml"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class DetectionResponse(DetectionResult):
    analysis_id: int

@router.post("/detect", response_model=DetectionResponse)
async def detect_poles(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if not file.content_type.startswith('image/'):
        raise HTTPException(400, "Файл должен быть изображением")
    
    try:
        contents = await file.read()
        
        result = model.detect(contents)
        
        image_with_boxes = model.draw_boxes(contents, result["bounding_boxes"])
        
        original_filename = file.filename
        
        file_extension = os.path.splitext(original_filename)[1]
        unique_filename = f"{uuid.uuid4()}_{original_filename}"
        filepath = os.path.join(UPLOAD_DIR, unique_filename)
        
        with open(filepath, "wb") as f:
            f.write(image_with_boxes)
        
        db_analysis = Analysis(
            image_path=filepath,
            original_filename=original_filename,
            poles_number=result["poles_count"],
            processing_time=result["processing_time"],
            bounding_boxes=result["bounding_boxes"],
            user_id=user.id
        )
        
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        
        boxes = [
            BoundingBox(
                x=box["x"],
                y=box["y"],
                width=box["width"],
                height=box["height"],
                confidence=box["confidence"],
                class_name=box["class"]
            )
            for box in result["bounding_boxes"]
        ]
        
        return DetectionResponse(
            analysis_id=db_analysis.id,
            poles_count=result["poles_count"],
            bounding_boxes=boxes,
            processing_time=result["processing_time"]
        )
        
    except Exception as e:
        raise HTTPException(500, f"Ошибка при обработке изображения: {str(e)}")

@router.get("/images/{filename}")
async def get_image(filename: str, user: User = Depends(get_current_user)):
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    if not os.path.exists(filepath):
        raise HTTPException(404, "Изображение не найдено")
    
    return Response(
        content=open(filepath, "rb").read(),
        media_type="image/jpeg"
    )

@router.get("/analysis/{analysis_id}/image")
async def get_analysis_image(
    analysis_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()
    
    if not analysis:
        raise HTTPException(404, "Анализ не найден")
    
    if user.role != "admin" and analysis.user_id != user.id:
        raise HTTPException(403, "Доступ запрещен")
    
    if not os.path.exists(analysis.image_path):
        raise HTTPException(404, "Файл изображения не найден")
    
    return Response(
        content=open(analysis.image_path, "rb").read(),
        media_type="image/jpeg"
    )