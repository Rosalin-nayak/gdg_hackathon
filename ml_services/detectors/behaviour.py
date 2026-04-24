import numpy as np
from collections import deque

FRAME_HISTORY = deque(maxlen=5)
PERSON_CLASS = 0

def compute_iou(box1, box2):
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])

    inter = max(0, x2 - x1) * max(0, y2 - y1)

    area1 = (box1[2]-box1[0]) * (box1[3]-box1[1])
    area2 = (box2[2]-box2[0]) * (box2[3]-box2[1])

    union = area1 + area2 - inter

    return inter / union if union > 0 else 0

def detect_behaviour(yolo_result):
    alerts = []
    current_boxes = []

    # Extract persons
    for box in yolo_result.boxes:
        cls = int(box.cls[0])
        conf = float(box.conf[0])

        if cls == PERSON_CLASS and conf > 0.4:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            current_boxes.append([x1, y1, x2, y2])

    FRAME_HISTORY.append(current_boxes)

    if len(current_boxes) >= 5:
        alerts.append("crowd_detected")

    overlaps = 0
    for i in range(len(current_boxes)):
        for j in range(i + 1, len(current_boxes)):
            if compute_iou(current_boxes[i], current_boxes[j]) > 0.3:
                overlaps += 1

    if overlaps >= 2:
        alerts.append("possible_fight")

    if len(FRAME_HISTORY) >= 2:
        prev_boxes = FRAME_HISTORY[-2]

        fall_candidates = 0

        for curr in current_boxes:
            best_prev = None
            best_iou = 0
            for prev in prev_boxes:
                iou = compute_iou(curr, prev)
                if iou > best_iou:
                    best_iou = iou
                    best_prev = prev

            if best_prev is None:
                continue
            cx_curr = (curr[0] + curr[2]) / 2
            cy_curr = (curr[1] + curr[3]) / 2

            cx_prev = (best_prev[0] + best_prev[2]) / 2
            cy_prev = (best_prev[1] + best_prev[3]) / 2

            dy = cy_curr - cy_prev

            w = curr[2] - curr[0]
            h = curr[3] - curr[1]
            aspect_ratio = w / h if h != 0 else 0

            is_lying = aspect_ratio > 1.5

            if dy > 40 and is_lying:
                fall_candidates += 1

        if fall_candidates > 0:
            alerts.append("fall_detected")

    return list(set(alerts))