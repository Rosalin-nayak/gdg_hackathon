from models.gesture_model import GestureModel
gesture_model=GestureModel()
def detect_gesture(frame):
    alerts=[]
    if gesture_model.detect(frame):
        alerts.append("sos_gesture")
    return alerts