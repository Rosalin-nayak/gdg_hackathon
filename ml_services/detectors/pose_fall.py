import cv2
import mediapipe as mp
import numpy as np
from collections import deque

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
ANGLE_HISTORY = deque(maxlen=10)
HEAD_Y_HISTORY = deque(maxlen=10)

def calculate_angle(p1, p2):
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    angle = np.degrees(np.arctan2(dy, dx))
    return abs(angle)

def detect_fall_pose(frame):
    alerts = []

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(frame_rgb)

    if not results.pose_landmarks:
        return []

    lm = results.pose_landmarks.landmark
    nose = lm[0]
    left_shoulder = lm[11]
    right_shoulder = lm[12]
    left_hip = lm[23]
    right_hip = lm[24]
    shoulder_mid = (
        (left_shoulder.x + right_shoulder.x) / 2,
        (left_shoulder.y + right_shoulder.y) / 2
    )
    hip_mid = (
        (left_hip.x + right_hip.x) / 2,
        (left_hip.y + right_hip.y) / 2
    )
    angle = calculate_angle(shoulder_mid, hip_mid)
    ANGLE_HISTORY.append(angle)
    is_horizontal = angle < 30

    HEAD_Y_HISTORY.append(nose.y)

    head_drop = 0
    if len(HEAD_Y_HISTORY) >= 2:
        head_drop = HEAD_Y_HISTORY[-1] - HEAD_Y_HISTORY[-2]
    horizontal_count = sum(1 for a in ANGLE_HISTORY if a < 30)
    if head_drop > 0.05 and is_horizontal:
        alerts.append("fall_detected")

    elif horizontal_count >= 5:
        alerts.append("person_lying")

    return alerts