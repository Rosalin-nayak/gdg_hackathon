from fastapi import APIRouter,UploadFile,File
import numpy as np
import cv2

from models.yolo_loader import YOLOModel
from detectors.behaviour import detect_behaviour
from utils.notifier import send_alert

try:
    from detectors.gesture import detect_gesture
except:
    detect_gesture = None

try:
    from detectors.pose_fall import detect_fall_pose
except:
    detect_fall_pose = None

router = APIRouter(prefix="/detect")
yolo = YOLOModel()

CAMERA_LOCATIONS = {
    "CAM_01": "Lobby",
    "CAM_02": "Entrance",
    "CAM_03": "Parking"
}

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

        gesture_alerts = []
        if detect_gesture:
            try:
                gesture_alerts = detect_gesture(frame)
            except:
                gesture_alerts = []

        pose_alerts = []
        if detect_fall_pose:
            try:
                pose_alerts = detect_fall_pose(frame)
            except:
                pose_alerts = []

        alerts = list(set(behaviour_alerts + gesture_alerts + pose_alerts))

        camera_id = "CAM_01"
        location = CAMERA_LOCATIONS.get(camera_id, "Unknown")

        mapping = {
            "possible_fight": "violence",
            "fall_detected": "fall",
            "crowd": "crowd"
        }

        for alert in alerts:
            mapped_alert = mapping.get(alert, alert)

            send_alert({
                "camera_id": camera_id,
                "detection_type": mapped_alert,
                "confidence": 0.9,
                "location": {
                "zone": location
                }
            })

        return {
            "success": True,
            "alerts": alerts
        }

    except Exception as e:
        print("ERROR:", str(e))
        return {"error": str(e)}