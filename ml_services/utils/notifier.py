from dotenv import load_dotenv

load_dotenv()

import os
import time
import requests

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:4000/alerts")
INTERNAL_SERVICE_KEY = os.getenv("INTERNAL_SERVICE_KEY")
ALERT_COOLDOWN_SECONDS = int(os.getenv("ALERT_COOLDOWN_SECONDS", "30"))

# (camera_id, detection_type) -> last sent monotonic time
_last_sent = {}


def _should_send(camera_id: str, detection_type: str) -> bool:
    key = (camera_id or "unknown", detection_type or "unknown")
    now = time.monotonic()
    last = _last_sent.get(key)
    if last is not None and (now - last) < ALERT_COOLDOWN_SECONDS:
        return False
    _last_sent[key] = now
    return True


def send_alert(event: dict):
    if not INTERNAL_SERVICE_KEY:
        print("Notifier skipped: INTERNAL_SERVICE_KEY is not set")
        return

    camera_id = event.get("camera_id")
    detection_type = event.get("detection_type")

    if not _should_send(camera_id, detection_type):
        print(
            f"Notifier skipped (cooldown): {detection_type} on {camera_id}"
        )
        return

    try:
        payload = {
            "type": detection_type,
            "cameraId": camera_id,
            "confidence": event.get("confidence"),
            "location": event.get("location"),
        }

        headers = {"x-service-key": INTERNAL_SERVICE_KEY}

        print("Sending payload:", payload)

        res = requests.post(
            BACKEND_URL,
            json=payload,
            headers=headers,
            timeout=2,
        )

        print("Response status:", res.status_code)
        print("Response body:", res.text)

    except Exception as e:
        print("Notifier error:", e)
