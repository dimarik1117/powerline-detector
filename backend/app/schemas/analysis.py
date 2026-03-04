from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AnalysisCreate(BaseModel):
    image_path: str
    poles_number: Optional[int] = Field(None, ge=0)
    processing_time: Optional[float] = Field(None, gt=0)

class AnalysisUpdate(BaseModel):
    poles_number: Optional[int] = Field(None, ge=0)
    processing_time: Optional[float] = Field(None, gt=0)

class AnalysisResponse(BaseModel):
    id: int
    image_path: str
    poles_number: Optional[int]
    processing_time: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True
