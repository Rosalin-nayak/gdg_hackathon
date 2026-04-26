import requests
import os

BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:4000/alerts")
SERVICE_KEY = os.getenv("SERVICE_KEY")

def send_alert(event: dict):
    try:
        payload = {
            "type": event.get("detection_type"),
            "cameraId": event.get("camera_id"),
            "confidence": event.get("confidence"),
            "location": event.get("location")
        }

        headers = {
            "x-service-key": SERVICE_KEY
        }

        print("Sending payload:", payload)

        res = requests.post(
            BACKEND_URL,
            json=payload,
            headers=headers,
            timeout=2
        )

        print("Response status:", res.status_code)
        print("Response body:", res.text)

    except Exception as e:
        print("Notifier error:", e)