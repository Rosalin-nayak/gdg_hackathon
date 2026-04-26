from fastapi import APIRouter, WebSocket
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

router = APIRouter()
yolo = YOLOModel()
CAMERA_LOCATIONS = {
    "CAM_01": "Lobby",
    "CAM_02": "Entrance",
    "CAM_03": "Parking"
}

@router.websocket("/stream/{cam_id}")
async def stream_endpoint(websocket: WebSocket, cam_id: str):
    await websocket.accept()
    last_sent = {}
    try:
        while True:
            data = await websocket.receive_bytes()

            np_arr = np.frombuffer(data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            if frame is None:
                continue
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
            await websocket.send_json({
                "cam_id": cam_id,
                "alerts": alerts
            })

            for alert in alerts:
                if last_sent.get(alert):
                    continue

                send_alert({
                    "camera_id": cam_id,
                    "detection_type": alert,
                    "confidence": 0.9,
                    "location": {
                        "zone": CAMERA_LOCATIONS.get(cam_id, "Unknown")
                    }
                })

                last_sent[alert] = True
    except Exception as e:
        print("WebSocket closed:", e)