from ultralytics import YOLO
import os
class YOLOModel:
    def __init__(self):
        weight_path = "weights/yolov8n.pt"
        if os.path.exists(weight_path):
            self.model = YOLO(weight_path)
        else:
            self.model = YOLO("yolov8n.pt")
    def predict(self, frame):
        return self.model(frame)[0]