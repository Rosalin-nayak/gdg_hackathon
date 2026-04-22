from fastapi import APIRouter,UploadFile,File
import numpy as np
import cv2

from models.yolo_loader import YOLOModel
from detectors.behaviour import detect_behaviour
from detectors.gesture import detect_gesture
from utils.notifier import send_alert

router = APIRouter(prefix="/detect")
yolo=YOLOModel()

@router.post("/frame")
async def detect_frame(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        print("File received")
        np_arr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return {"error": "Invalid image"}
        
        print("Frame shape:", frame.shape)

        result = yolo.predict(frame)

        return {"status": "success"}

    except Exception as e:
        print("ERROR:", str(e))
        return {"error": str(e)}