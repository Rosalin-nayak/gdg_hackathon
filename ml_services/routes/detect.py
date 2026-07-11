from fastapi import APIRouter, UploadFile, File
import numpy as np
import cv2
import logging

from models.yolo_loader import YOLOModel
from detectors.behaviour import detect_behaviour

from detectors.violence_detector import ViolenceDetector
from detectors.fall_detector import FallDetector
from detectors.gesture_detector import GestureDetector
from detectors.person_detector import PersonDetector
from detectors.chase_detector import ChaseDetector
from detectors.audio_detector import AudioDetector

from utils.notifier import send_alert
logger = logging.getLogger(__name__)
router = APIRouter(prefix="/detect")
# ---------------- Initialize Models ----------------

yolo = YOLOModel()
violence_detector = ViolenceDetector()
violence_detector.load()
fall_detector = FallDetector()
fall_detector.load()
gesture_detector = GestureDetector()
gesture_detector.load()
person_detector = PersonDetector()
person_detector.load()
chase_detector = PersonDetector()
chase_detector.load()
audio_detector = PersonDetector()
audio_detector.load()

# Store frames for C3D model
violence_frames = []
CAMERA_LOCATIONS = {
    "CAM_01": "Lobby",
    "CAM_02": "Entrance",
    "CAM_03": "Parking"
}

@router.post("/frame")
async def detect_frame(file: UploadFile = File(...)):

    try:
        # ---------------- Read Image ----------------

        contents = await file.read()

        np_arr = np.frombuffer(
            contents,
            np.uint8
        )
        frame = cv2.imdecode(
            np_arr,
            cv2.IMREAD_COLOR
        )
        if frame is None:
            return {
                "error": "Invalid image"
            }

        alerts = []
        # ---------------- Person Detection ----------------

        persons = person_detector.detect(frame)
        person_count = len(persons)
        # ---------------- YOLO Behaviour Detection ----------------

        yolo_result = yolo.predict(frame)

        behaviour_alerts = detect_behaviour(
            yolo_result
        )

        alerts.extend(
            behaviour_alerts
        )

        # ---------------- Violence Detection ----------------

        global violence_frames

        violence_frames.append(frame)
        if len(violence_frames) >= 16:

            violence_conf = violence_detector.predict(
                violence_frames[-16:]
            )
            if violence_conf >= 0.70:

                alerts.append(
                    "violence"
                )

        # ---------------- Fall Detection ----------------

        fall_result = fall_detector.detect(
            frame
        )
        if fall_result["fallen"]:

            alerts.append(
                "fall"
            )
        # ---------------- Gesture Detection ----------------

        gesture_result = gesture_detector.detect(
            frame
        )
        if gesture_result["sos_detected"]:

            alerts.append(
                "sos"
            )

        # ---------------- CHASE Detection ----------------
        chase_result = chase_detector.update(
            frame,
            persons
        )


        if chase_result["chasing"]:

            alerts.append(
                "chase"
            )
        # ---------------- AUDIO Detection ----------------
        if audio_detector.keyword_detected():

            alerts.append(
                "audio_help"
            )

        # Remove duplicates

        alerts = list(set(alerts))

        # ---------------- Send Alerts ----------------

        camera_id = "CAM_01"

        location = CAMERA_LOCATIONS.get(
            camera_id,
            "Unknown"
        )

        mapping = {
            "possible_fight": "violence",
            "fall_detected": "fall",
            "fallen": "fall",
            "wave_distress": "sos",
            "sos_help": "sos"
        }

        for alert in alerts:
            detection_type = mapping.get(
                alert,
                alert
            )


            send_alert({
                "camera_id": camera_id,
                "detection_type": detection_type,
                "confidence": 0.9,
                "location": {
                    "zone": location
                }
            })



        return {
            "success": True,
            "alerts": alerts,
            "persons_detected": person_count,
            "fall_details": fall_result,
            "gesture_details": gesture_result
        }



    except Exception as e:

        logger.error(
            str(e)
        )
        return {
            "error": str(e)
        }