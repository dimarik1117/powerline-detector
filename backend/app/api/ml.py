from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
import os
import uuid
import logging

from app.db.database import SessionLocal
from app.core.dependencies import get_current_user
from app.models.analysis import Analysis
from app.models.user import User
from app.ml.service import ml_service
from app.schemas.ml import DetectionResult, BoundingBox, DetectionResponse
from app.schemas.analysis import AnalysisResponse

router = APIRouter(prefix="/api/v1/ml", tags=["ml"])
logger = logging.getLogger(__name__)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

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
        
        logger.info(f"Начало обработки изображения {file.filename} пользователем {user.username}")
        
        analysis_result = await ml_service.analyze_image(contents)
        
        if not analysis_result["success"]:
            logger.error(f"Ошибка анализа: {analysis_result.get('error')}")
            raise HTTPException(500, f"Ошибка анализа изображения: {analysis_result.get('error')}")
        
        result = analysis_result["result"]
        image_with_boxes = analysis_result["image_with_boxes"]
        
        original_filename = file.filename
        
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
        
        logger.info(f"Анализ завершен. ID: {db_analysis.id}, Опор: {result['poles_count']}")
        
        boxes = [
            BoundingBox(
                x=box["x"],
                y=box["y"],
                width=box["width"],
                height=box["height"],
                confidence=box["confidence"],
                class_name=box.get("class", "power_line_pole")
            )
            for box in result["bounding_boxes"]
        ]
        
        return DetectionResponse(
            analysis_id=db_analysis.id,
            poles_count=result["poles_count"],
            bounding_boxes=boxes,
            processing_time=result["processing_time"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Неожиданная ошибка: {str(e)}")
        raise HTTPException(500, f"Внутренняя ошибка сервера: {str(e)}")

@router.get("/images/{filename}")
async def get_image(
    filename: str,
    user: User = Depends(get_current_user)
):
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

@router.get("/info")
async def get_model_info(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(403, "Доступ запрещен")
    
    return ml_service.get_model_info()