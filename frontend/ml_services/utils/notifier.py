import requests

BACKEND_URL = "http://localhost:4000/alerts"

def send_alert(event: dict):
    try:
        payload = {
            "type": event.get("detection_type"),
            "cameraId": event.get("camera_id"),
            "confidence": event.get("confidence"),
            "location": event.get("location")
        }

        requests.post(BACKEND_URL, json=payload, timeout=2)

    except Exception as e:
        print("Notifier error:", e)