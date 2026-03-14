from pydantic import BaseModel
from typing import List, Optional

class BoundingBox(BaseModel):
    x: int
    y: int
    width: int
    height: int
    confidence: float
    class_name: str = "power_line_pole"

class DetectionResult(BaseModel):
    poles_count: int
    bounding_boxes: List[BoundingBox]
    processing_time: float

class DetectionResponse(BaseModel):
    analysis_id: int
    poles_count: int
    bounding_boxes: List[BoundingBox]
    processing_time: float

class AnalysisResponse(BaseModel):
    id: Optional[int] = None
    poles_number: int
    processing_time: float
    bounding_boxes: List[BoundingBox]
    image_path: str