import numpy as np
from collections import deque

FRAME_HISTORY=deque(maxlen=10)
PERSON_CLASS=0
def compute_iou(box1,box2):
    x1=max(box1[0],box2[0])
    y1=max(box2[1],box2[1])
    x2=min(box1[2],box2[2])
    y2=min(box1[3],box2[3])

    inter_area=max(0,x2-x1)+max(0,y2-y1)
    box1_area=(box1[2]-box1[0]) * (box1[3]-box1[1])
    box2_area=(box2[2]-box2[0]) * (box2[3]-box2[1])
    union=box1_area+box2_area-inter_area
    return inter_area/union if union>0 else 0

def detect_behaviour(yolo_result):
    alerts=[]
    current_boxes=[]
    for box in yolo_result.boxes:
        cls=int(box.cls[0])
        conf=float(box.conf[0])
        if cls==PERSON_CLASS and conf>0.6:
            x1,y1,x2,y2=box.xyxy[0].tolist()
            current_boxes.append([x1,y1,x2,y2])
    FRAME_HISTORY.append(current_boxes)

    if len(current_boxes)>=3:
        alerts.append("crowd detected")
        overlaps=0
        for i in range(len(current_boxes)):
            for j in range(i+1,len(current_boxes)):
                if compute_iou(current_boxes[i],current_boxes[j])>0.2:
                    overlaps+=1
        if overlaps>=2:
            alerts.append("possible_fight")

    if len(FRAME_HISTORY)>=2:
        prev_boxes=FRAME_HISTORY[-2]
        movement_scores=[]
        for curr in current_boxes:
            best_iou=0
            for prev in prev_boxes:
                best_iou=max(best_iou,compute_iou(curr,prev))
            movement_scores.append(1-best_iou)

        if movement_scores and np.mean(movement_scores)>0.7:
            alerts.append("sudden_movement")

    for box in current_boxes:
        x1,y1,x2,y2=box
        if(x2-x1)>(y2-y1):
            if (x2-x1)>(y2-y1):
                alerts.append("possible_fall")
    return list(set(alerts))

