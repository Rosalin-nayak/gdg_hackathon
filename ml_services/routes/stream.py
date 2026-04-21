from fastapi import APIRouter, WebSocket
import numpy as np
import cv2

from models.yolo_loader import YOLOModel
from detectors.behaviour import detect_behaviour
from detectors.gesture import detect_gesture

router = APIRouter()
yolo = YOLOModel()

@router.websocket("/stream/{cam_id}")
async def stream_endpoint(websocket: WebSocket, cam_id: str):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_bytes()

            np_arr = np.frombuffer(data, np.uint8)
            frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

            result = yolo.predict(frame)

            alerts = []
            alerts += detect_behaviour(result)
            alerts += detect_gesture(frame)

            await websocket.send_json({
                "cam_id": cam_id,
                "alerts": alerts
            })

    except Exception as e:
        print("WebSocket closed:", e)