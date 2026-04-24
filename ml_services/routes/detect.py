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
        print("File received")
        np_arr = np.frombuffer(contents, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if frame is None:
            return {"error": "Invalid image"}
        
        print("Frame shape:", frame.shape)

        result = yolo.predict(frame)
        print("YOLO done")

        behaviour_alerts=detect_behaviour(result)
        print("Behaviour alerts:",behaviour_alerts)
        gesture_alerts=detect_gesture(frame)
        print("Gesture alerts:",gesture_alerts)
        pose_alerts=detect_fall_pose(frame)
        print("Pose alerts:",pose_alerts)

        alerts=behaviour_alerts+gesture_alerts+pose_alerts
        # if alerts:
            # send_alert({"alerts":alerts})
        return {"alerts":alerts}

    except Exception as e:
        print("ERROR:", str(e))
        return {"error": str(e)}