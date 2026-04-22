import requests

BACKEND_URL = "http://localhost:8000/api/alert"

def send_alert(event: dict):
    try:
        requests.post(BACKEND_URL, json=event, timeout=2)
    except Exception as e:
        print("Notifier error:", e)