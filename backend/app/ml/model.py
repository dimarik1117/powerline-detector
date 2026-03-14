import numpy as np
from PIL import Image
import io
import random
from typing import List, Dict, Any
import time

class PowerLineDetector:
    def __init__(self):
        self.model_loaded = True
        print("Модель детекции опор ЛЭП инициализирована")
    
    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        image = Image.open(io.BytesIO(image_bytes))
        return np.array(image)
    
    def detect(self, image_bytes: bytes) -> Dict[str, Any]:
        start_time = time.time()
        
        image = self.preprocess_image(image_bytes)
        num_poles = random.randint(1, 6)
        
        height, width = image.shape[:2] if len(image.shape) > 2 else (224, 224)
        
        bounding_boxes = []
        for i in range(num_poles):
            x = random.randint(0, width - 100)
            y = random.randint(0, height - 200)
            w = random.randint(50, 150)
            h = random.randint(150, 300)
            
            bounding_boxes.append({
                "x": x,
                "y": y,
                "width": w,
                "height": h,
                "confidence": round(random.uniform(0.7, 0.99), 2),
                "class": "power_line_pole"
            })
        
        processing_time = time.time() - start_time
        
        return {
            "poles_count": num_poles,
            "bounding_boxes": bounding_boxes,
            "processing_time": round(processing_time, 3)
        }
    
    def draw_boxes(self, image_bytes: bytes, boxes: List[Dict]) -> bytes:
        from PIL import ImageDraw, Image
        
        image = Image.open(io.BytesIO(image_bytes))
        draw = ImageDraw.Draw(image)
        
        for box in boxes:
            x, y, w, h = box['x'], box['y'], box['width'], box['height']
            confidence = box['confidence']
            
            draw.rectangle(
                [x, y, x + w, y + h],
                outline='red',
                width=3
            )
            
            draw.text(
                (x, y - 15),
                f"{confidence:.2f}",
                fill='red'
            )
        
        img_byte_arr = io.BytesIO()
        image.save(img_byte_arr, format='JPEG')
        img_byte_arr.seek(0)
        
        return img_byte_arr.getvalue()

model = PowerLineDetector()
