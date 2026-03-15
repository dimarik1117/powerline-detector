from typing import Optional, Dict, Any
import logging
from .model import model, PowerLineDetector

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self, detector: PowerLineDetector):
        self.detector = detector
    
    async def analyze_image(self, image_bytes: bytes) -> Dict[str, Any]:
        try:
            result = self.detector.detect(image_bytes)
            
            image_with_boxes = self.detector.draw_boxes(
                image_bytes, 
                result["bounding_boxes"]
            )
            
            return {
                "success": True,
                "result": result,
                "image_with_boxes": image_with_boxes
            }
            
        except Exception as e:
            logger.error(f"Ошибка анализа изображения: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "result": {
                    "poles_count": 0,
                    "bounding_boxes": [],
                    "processing_time": 0
                },
                "image_with_boxes": image_bytes
            }
    
    def get_model_info(self) -> Dict[str, Any]:
        return self.detector.get_model_info()

ml_service = MLService(model)