import numpy as np
import cv2
from PIL import Image
import io
import time
import os
from typing import List, Dict, Any, Optional
import logging
from ultralytics import YOLO
import torch

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PowerLineDetector:
    def __init__(self, model_path: Optional[str] = None):
        self.model_loaded = False
        self.model = None
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        
        logger.info(f"Инициализация модели на устройстве: {self.device}")
        
        try:
            if model_path is None:
                custom_model = 'pole_detector.pt'
                if os.path.exists(custom_model):
                    model_path = custom_model
                    logger.info(f"Найдена пользовательская модель: {custom_model}")
                else:
                    model_path = 'yolov8n.pt'
                    logger.info("Используется базовая модель YOLOv8n")
            
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"Модель не найдена по пути: {model_path}")
            
            logger.info(f"Загрузка модели из {model_path}")
            self.model = YOLO(model_path)
            
            if self.device == 'cuda':
                self.model.to('cuda')
                logger.info("Модель перемещена на GPU")
            
            self.model_loaded = True
            
        except Exception as e:
            logger.error(f"Критическая ошибка при загрузке модели: {e}")
            self.model_loaded = False
            raise RuntimeError(f"Не удалось загрузить модель: {e}")
    
    def preprocess_image(self, image_bytes: bytes) -> np.ndarray:
        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                logger.debug("OpenCV не смог декодировать, пробуем через PIL")
                pil_img = Image.open(io.BytesIO(image_bytes))
                img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
            
            height, width = img.shape[:2]
            logger.debug(f"Изображение загружено: {width}x{height}")
            
            return img
            
        except Exception as e:
            logger.error(f"Ошибка предобработки изображения: {str(e)}")
            raise ValueError(f"Не удалось обработать изображение: {e}")
    
    def detect(self, image_bytes: bytes) -> Dict[str, Any]:
        start_time = time.time()
        
        try:
            if not self.model_loaded or self.model is None:
                raise RuntimeError("Модель не загружена")
            
            img = self.preprocess_image(image_bytes)
            
            logger.debug("Запуск инференса модели")
            results = self.model(img, conf=0.25, iou=0.45)
            
            boxes_data = []
            poles_count = 0
            
            if len(results) > 0 and results[0].boxes is not None:
                boxes = results[0].boxes
                
                for box in boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    confidence = float(box.conf[0])
                    class_id = int(box.cls[0])
                    class_name = self.model.names[class_id]
                    
                    x = int(x1)
                    y = int(y1)
                    width = int(x2 - x1)
                    height = int(y2 - y1)

                    is_pole = True
                    
                    if is_pole:
                        poles_count += 1
                        boxes_data.append({
                            "x": x,
                            "y": y,
                            "width": width,
                            "height": height,
                            "confidence": round(confidence, 3),
                            "class": class_name
                        })
                        
                        logger.debug(f"Обнаружен объект: {class_name} с уверенностью {confidence:.3f}")
            
            processing_time = time.time() - start_time
            
            logger.info(f"Детекция завершена: найдено {poles_count} опор за {processing_time:.3f} сек")
            
            return {
                "poles_count": poles_count,
                "bounding_boxes": boxes_data,
                "processing_time": round(processing_time, 3)
            }
            
        except Exception as e:
            logger.error(f"Ошибка во время детекции: {str(e)}")
            processing_time = time.time() - start_time
            
            return {
                "poles_count": 0,
                "bounding_boxes": [],
                "processing_time": round(processing_time, 3),
                "error": str(e)
            }
    
    def draw_boxes(self, image_bytes: bytes, boxes: List[Dict]) -> bytes:
        try:
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                pil_img = Image.open(io.BytesIO(image_bytes))
                img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
            
            colors = [
                (255, 0, 0),
                (0, 255, 0),
                (0, 0, 255),
                (255, 255, 0),
                (255, 0, 255),
                (0, 255, 255),
            ]
            
            for i, box in enumerate(boxes):
                x = box['x']
                y = box['y']
                w = box['width']
                h = box['height']
                confidence = box['confidence']
                
                color = colors[i % len(colors)]
                
                thickness = 3
                cv2.rectangle(img, (x, y), (x + w, y + h), color, thickness)
                
                overlay = img.copy()
                cv2.rectangle(overlay, (x, y), (x + w, y + h), color, -1)
                cv2.addWeighted(overlay, 0.1, img, 0.9, 0, img)
                
                label = f"{confidence:.2f}"
                
                font_scale = 0.6
                font_thickness = 2
                (text_width, text_height), baseline = cv2.getTextSize(
                    label, cv2.FONT_HERSHEY_SIMPLEX, font_scale, font_thickness
                )
                
                cv2.rectangle(
                    img,
                    (x, y - text_height - 10),
                    (x + text_width + 10, y),
                    color,
                    -1
                )
                
                cv2.putText(
                    img,
                    label,
                    (x + 5, y - 5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    font_scale,
                    (255, 255, 255),
                    font_thickness
                )
                
                cv2.putText(
                    img,
                    str(i + 1),
                    (x + 5, y + 25),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.8,
                    (255, 255, 255),
                    2
                )
            
            info_text = f"Poles found: {len(boxes)}"
            cv2.putText(
                img,
                info_text,
                (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )
            
            _, buffer = cv2.imencode('.jpg', img, [cv2.IMWRITE_JPEG_QUALITY, 90])
            return buffer.tobytes()
            
        except Exception as e:
            logger.error(f"Ошибка при рисовании боксов: {str(e)}")
            return image_bytes
    
    def get_model_info(self) -> Dict[str, Any]:
        return {
            "device": self.device,
            "model_loaded": self.model_loaded,
            "model_type": "YOLOv8",
            "classes": list(self.model.names.values()) if self.model and hasattr(self.model, 'names') else []
        }

try:
    model = PowerLineDetector()
    logger.info("Модель успешно инициализирована.")
except Exception as e:
    logger.error(f"Не удалось инициализировать модель: {e}")
    model = None