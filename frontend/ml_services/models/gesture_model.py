import cv2
import mediapipe as mp
from collections import deque
import time

class GestureModel:
    def __init__(self):
        self.mp_hands=mp.solutions.hands
        self.hands=self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.6,
            min_tracking_confidence=0.5
        )
        self.state_history=deque(maxlen=20)
        self.time_history=deque(maxlen=20)

    def _is_hand_open(self,landmarks):
        tips=[8,12,16,20]
        pip=[6,10,14,18]
        open_fingers=0
        for t,p in zip(tips,pip):
            if landmarks[t].y<landmarks[p].y:
                open_fingers+=1
        return open_fingers>=3
    
    def _is_fist(self,landmarks):
        tips=[8,12,16,20]
        pip=[6,10,14,18]
        closed_fingers=0
        for t,p in zip(tips,pip):
            if landmarks[t].y<landmarks[p].y:
                closed_fingers+=1
        return closed_fingers>=3
    
    def _update_history(self,state):
        now=time.time()
        self.state_history.append(state)
        self.time_history.append(now)

    def _detect_sos_pattern(self):
        if len(self.state_history)<6:
            return False
        states=list(self.state_history)
        times=list(self.time_history)
        compressed=[]
        for s in states:
            if not compressed or compressed[-1] != s:
                compressed.append(s)
            
        if len(compressed)>=3:
            if compressed[-3:]==["open","fist","open"]:
                if times[-1]-times[-3]<3:
                    return True
                
        return False
    
    def detect(self,frame):
        rgb=cv2.cvtColor(frame,cv2.COLOR_BGR2RGB)
        result=self.hands.process(rgb)
        if not result.multi_hand_landmarks:
            return False
        for hand_landmarks in result.multi_hand_landmarks:
            landmarks=hand_landmarks.landmark
        if self._is.hand_open(landmarks):
            self._update_history("open")
        elif self._is_fist(landmarks):
            self._update_history("fist")
        else:
            self._update_history("unknown")
            
        return self._detect_sos_pattern()