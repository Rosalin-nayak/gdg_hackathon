"""
PersonDetector — YOLOv8n for real-time person bounding boxes.
Falls back to OpenCV HOG if ultralytics is not installed.
"""

import logging
import numpy as np
from typing import List, Dict

logger = logging.getLogger(__name__)


class PersonDetector:
    CONFIDENCE_THRESHOLD = 0.45

    def __init__(self):
        self.model = None
        self._use_yolo = False

    def load(self):
        try:
            from ultralytics import YOLO
            self.model = YOLO("yolov8n.pt")   # auto-downloads on first run
            self._use_yolo = True
            logger.info("PersonDetector: YOLOv8n loaded.")
        except ImportError:
            import cv2
            self.model = cv2.HOGDescriptor()
            self.model.setSVMDetector(cv2.HOGDescriptor.getDefaultPeopleDetector())
            logger.warning("PersonDetector: ultralytics not found, using HOG fallback.")

    def detect(self, frame: np.ndarray) -> List[Dict]:
        if self._use_yolo:
            return self._yolo_detect(frame)
        return self._hog_detect(frame)

    def _yolo_detect(self, frame: np.ndarray) -> List[Dict]:
        results = self.model(frame, classes=[0], verbose=False)[0]   # class 0 = person
        detections = []
        for box in results.boxes:
            conf = float(box.conf[0])
            if conf < self.CONFIDENCE_THRESHOLD:
                continue
            x1,y1,x2,y2 = map(int, box.xyxy[0].tolist())
            detections.append({"conf": conf, "bbox": [x1,y1,x2,y2]})
        return detections

    def _hog_detect(self, frame: np.ndarray) -> List[Dict]:
        import cv2
        small = cv2.resize(frame, (640, 480))
        rects, weights = self.model.detectMultiScale(
            small, winStride=(8,8), padding=(4,4), scale=1.05)
        detections = []
        for (x,y,w,h), weight in zip(rects, weights):
            detections.append({"conf": float(weight[0]), "bbox": [x,y,x+w,y+h]})
        return detections
