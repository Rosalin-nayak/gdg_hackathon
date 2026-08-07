# from models.gesture_model import GestureModel
# gesture_model=GestureModel()
# def detect_gesture(frame):
#     alerts=[]
#     if gesture_model.detect(frame):
#         alerts.append("sos_gesture")
#     return alerts

"""
GestureDetector — MediaPipe Hands + SOS gesture classifier.
Detects the international "signal for help" gesture:
  Phase 1: Hand open, thumb tucked in.
  Phase 2: Fingers close over thumb (fold down).
Also detects: waving hand repeatedly (distress signal).
"""

import logging
import numpy as np
import cv2
from typing import Dict, Any
from collections import deque
import math

logger = logging.getLogger(__name__)

WAVE_WINDOW  = 30  #frames
WAVE_MIN     = 3   #direction changes in window = waving


class GestureDetector:
    def __init__(self):
        self.hands    = None
        self.mp_hands = None
        self._x_hist  = deque(maxlen=WAVE_WINDOW)   # wrist x-positions

    def load(self):
        try:
            import mediapipe as mp
            self.mp_hands = mp.solutions.hands
            self.hands    = mp.solutions.hands.Hands(
                static_image_mode=False,
                max_num_hands=2,
                min_detection_confidence=0.6,
                min_tracking_confidence=0.5,
            )
            logger.info("GestureDetector: MediaPipe Hands loaded.")
        except Exception as e:
            self.hands = None
            self.mp_hands = None
            logger.warning(
                "GestureDetector: MediaPipe Hands unavailable (%s) — gesture detection disabled.",
                e,
            )

    def detect(self, frame: np.ndarray) -> Dict[str, Any]:
        if self.hands is None:
            return {"sos_detected": False, "gesture": "none", "confidence": 0.0}

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        res = self.hands.process(rgb)

        if not res.multi_hand_landmarks:
            self._x_hist.append(None)
            return {"sos_detected": False, "gesture": "none", "confidence": 0.0}

        for hand_lm in res.multi_hand_landmarks:
            lm = hand_lm.landmark

            # ── SOS "signal for help" gesture ────────────────────────────────
            if self._is_sos_gesture(lm):
                return {"sos_detected": True, "gesture": "sos_help", "confidence": 0.92}

            # ── Waving hand ───────────────────────────────────────────────────
            wrist_x = lm[0].x
            self._x_hist.append(wrist_x)
            if self._is_waving():
                return {"sos_detected": True, "gesture": "wave_distress", "confidence": 0.75}

        return {"sos_detected": False, "gesture": "none", "confidence": 0.0}

    # ── Gesture heuristics ────────────────────────────────────────────────────

    def _is_sos_gesture(self, lm) -> bool:
        """
        International signal for help:
          Open palm facing camera, thumb inside, fingers close over it.
        We approximate by checking:
          - Thumb tip BELOW index MCP (thumb tucked)
          - All four fingers bent (tip y > pip y in image coords)
        """
        # Landmark indices (MediaPipe)
        THUMB_TIP  = 4;  THUMB_IP   = 3;  THUMB_MCP = 2
        INDEX_MCP  = 5;  INDEX_PIP  = 6;  INDEX_TIP = 8
        MID_PIP    = 10; MID_TIP    = 12
        RING_PIP   = 14; RING_TIP   = 16
        PINKY_PIP  = 18; PINKY_TIP  = 20

        thumb_tucked = lm[THUMB_TIP].y > lm[INDEX_MCP].y  # below index knuckle
        index_bent   = lm[INDEX_TIP].y > lm[INDEX_PIP].y
        mid_bent     = lm[MID_TIP].y   > lm[MID_PIP].y
        ring_bent    = lm[RING_TIP].y  > lm[RING_PIP].y
        pinky_bent   = lm[PINKY_TIP].y > lm[PINKY_PIP].y

        return thumb_tucked and index_bent and mid_bent and ring_bent and pinky_bent



    def _is_waving(self) -> bool:
        """Count direction reversals in recent wrist x-history."""
        vals = [x for x in self._x_hist if x is not None]
        if len(vals) < 10:
            return False
        reversals = 0
        for i in range(2, len(vals)):
            if (vals[i] - vals[i-1]) * (vals[i-1] - vals[i-2]) < 0:
                reversals += 1
        return reversals >= WAVE_MIN
