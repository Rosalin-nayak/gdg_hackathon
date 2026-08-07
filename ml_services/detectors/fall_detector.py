"""
FallDetector — MediaPipe Pose + geometric angle classifier.

Algorithm:
  1. Detect 33 body landmarks with MediaPipe Pose.
  2. Compute hip-to-shoulder angle relative to vertical axis.
  3. Compute torso aspect ratio (height vs width of bounding box).
  4. If angle > ANGLE_THRESHOLD AND aspect_ratio < RATIO_THRESHOLD → FALL.
  5. Confirm over N consecutive frames to reduce false positives.
"""

import logging
import numpy as np
import cv2
from typing import Dict, Any
from collections import deque

logger = logging.getLogger(__name__)

ANGLE_THRESHOLD  = 50    # degrees from vertical — person is tilted
RATIO_THRESHOLD  = 0.60  # width/height > this → person is horizontal
CONFIRM_FRAMES   = 5     # must trigger N frames in a row


class FallDetector:
    def __init__(self):
        self.pose      = None
        self._history  = deque(maxlen=CONFIRM_FRAMES)

    def load(self):
        try:
            import mediapipe as mp
            self.pose = mp.solutions.pose.Pose(
                static_image_mode=False,
                model_complexity=1,
                min_detection_confidence=0.5,
                min_tracking_confidence=0.5,
            )
            logger.info("FallDetector: MediaPipe Pose loaded.")
        except Exception as e:
            self.pose = None
            logger.warning(
                "FallDetector: MediaPipe Pose unavailable (%s) — using bounding-box fallback.",
                e,
            )

    def detect(self, frame: np.ndarray) -> Dict[str, Any]:
        if self.pose is None:
            return self._bbox_fallback(frame)
        return self._pose_detect(frame)

    # ── MediaPipe path ────────────────────────────────────────────────────────
    def _pose_detect(self, frame: np.ndarray) -> Dict[str, Any]:
        import mediapipe as mp
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        res = self.pose.process(rgb)

        if not res.pose_landmarks:
            self._history.append(False)
            return {"fallen": False, "confidence": 0.0, "bbox": None}

        lm = res.pose_landmarks.landmark
        h, w = frame.shape[:2]

        # Key landmarks
        LEFT_HIP   = mp.solutions.pose.PoseLandmark.LEFT_HIP
        RIGHT_HIP  = mp.solutions.pose.PoseLandmark.RIGHT_HIP
        LEFT_SHLDR = mp.solutions.pose.PoseLandmark.LEFT_SHOULDER
        RIGHT_SHLDR= mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER

        hip_mid  = np.array([(lm[LEFT_HIP.value].x + lm[RIGHT_HIP.value].x)/2,
                              (lm[LEFT_HIP.value].y + lm[RIGHT_HIP.value].y)/2])
        shldr_mid= np.array([(lm[LEFT_SHLDR.value].x + lm[RIGHT_SHLDR.value].x)/2,
                              (lm[LEFT_SHLDR.value].y + lm[RIGHT_SHLDR.value].y)/2])

        # Angle of spine with vertical (y-axis)
        torso_vec = shldr_mid - hip_mid
        angle = abs(np.degrees(np.arctan2(torso_vec[0], -torso_vec[1])))

        # Bounding box aspect ratio
        xs = [l.x for l in lm]; ys = [l.y for l in lm]
        bw = (max(xs) - min(xs)) * w
        bh = (max(ys) - min(ys)) * h
        ratio = bw / max(bh, 1)

        is_fallen = (angle > ANGLE_THRESHOLD) or (ratio > RATIO_THRESHOLD)
        self._history.append(is_fallen)

        confirmed = sum(self._history) >= CONFIRM_FRAMES - 1

        conf = min(1.0, (angle / 90) * 0.6 + ratio * 0.4) if is_fallen else 0.0
        bbox = None
        if confirmed:
            x1 = int(min(xs) * w); y1 = int(min(ys) * h)
            x2 = int(max(xs) * w); y2 = int(max(ys) * h)
            bbox = [x1, y1, x2, y2]

        return {"fallen": confirmed, "confidence": round(conf, 2), "bbox": bbox}

    # ── HOG bounding-box fallback ─────────────────────────────────────────────
    def _bbox_fallback(self, frame: np.ndarray) -> Dict[str, Any]:
        """Very rough fallback: detect horizontal bounding boxes."""
        import cv2
        hog = cv2.HOGDescriptor()
        hog.setSVMDetector(cv2.HOGDescriptor.getDefaultPeopleDetector())
        rects, _ = hog.detectMultiScale(frame, winStride=(8,8))
        for (x,y,w,h) in rects:
            ratio = w / max(h, 1)
            if ratio > RATIO_THRESHOLD:
                return {"fallen": True, "confidence": 0.65, "bbox": [x,y,x+w,y+h]}
        self._history.append(False)
        return {"fallen": False, "confidence": 0.0, "bbox": None}
