from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class BoundingBoxSchema(BaseModel):
    x: int
    y: int
    width: int
    height: int
    confidence: float
    class_name: str

class AnalysisCreate(BaseModel):
    image_path: str
    original_filename: Optional[str] = None
    poles_number: Optional[int] = Field(None, ge=0)
    processing_time: Optional[float] = Field(None, gt=0)
    bounding_boxes: Optional[List[Dict[str, Any]]] = None

class AnalysisUpdate(BaseModel):
    poles_number: Optional[int] = Field(None, ge=0)
    processing_time: Optional[float] = Field(None, gt=0)

class AnalysisResponse(BaseModel):
    id: int
    image_path: str
    original_filename: Optional[str] = None
    poles_number: Optional[int]
    processing_time: Optional[float]
    bounding_boxes: Optional[List[Dict[str, Any]]] = None
    created_at: datetime

    class Config:
        from_attributes = True
