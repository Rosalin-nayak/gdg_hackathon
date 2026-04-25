from fastapi import APIRouter,UploadFile,File
import numpy as np
import cv2

from models.yolo_loader import YOLOModel
from detectors.behaviour import detect_behaviour
from detectors.gesture import detect_gesture
from detectors.pose_fall import detect_fall_pose
from utils.notifier import send_alert

router = APIRouter(prefix="/detect")
yolo=YOLOModel()

@router.post("/frame")
async def detect_frame(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        np_arr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return {"error": "Invalid image"}

        result = yolo.predict(frame)

        behaviour_alerts = detect_behaviour(result)
        gesture_alerts = detect_gesture(frame)
        pose_alerts = detect_fall_pose(frame)

        alerts = list(set(behaviour_alerts + gesture_alerts + pose_alerts))

        for alert in alerts:
            send_alert({
                "camera_id": "CAM_01",
                "detection_type": alert,
                "confidence": 0.9,
                "location": {
                    "zone": "Lobby"
                }
            })

        return {
            "success": True,
            "alerts": alerts
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {"error": str(e)}