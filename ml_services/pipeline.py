"""
EXPERIMENTAL / NOT WIRED — reference design only.

The live webcam path uses routes/detect.py, which loads detectors directly.
This module sketches a unified pipeline API for a future refactor; it is not
imported by main.py.
"""

import logging
import numpy as np
from typing import Dict, Any, List
from collections import deque

from detectors.violence_detector import ViolenceDetector
from detectors.fall_detector import FallDetector
from detectors.chase_detector import ChaseDetector
from detectors.gesture_detector import GestureDetector
from detectors.audio_detector import AudioDetector
from detectors.person_detector import PersonDetector

logger = logging.getLogger(__name__)


class SentinelPipeline:
    FRAME_BUFFER_LEN = 16   # frames fed to 3D-CNN

    def __init__(self):
        self.person    = PersonDetector()
        self.violence  = ViolenceDetector()
        self.fall      = FallDetector()
        self.chase     = ChaseDetector()
        self.gesture   = GestureDetector()
        self.audio     = AudioDetector()

        # Per-camera rolling frame buffers
        self._buffers: Dict[str, deque] = {}

    # ── Load all models ───────────────────────────────────────────────────────
    def load(self):
        logger.info("Loading PersonDetector…")
        self.person.load()
        logger.info("Loading ViolenceDetector…")
        self.violence.load()
        logger.info("Loading FallDetector…")
        self.fall.load()
        logger.info("Loading ChaseDetector…")
        self.chase.load()
        logger.info("Loading GestureDetector…")
        self.gesture.load()
        logger.info("Loading AudioDetector…")
        self.audio.load()
        logger.info("✅ All detectors ready.")

    # ── Main entry point ──────────────────────────────────────────────────────
    def run(self, frame: np.ndarray, camera_id: str) -> Dict[str, Any]:
        """
        Analyze one frame from a camera.
        Returns a unified result dict consumed by the WebSocket handler.
        """
        buf = self._get_buffer(camera_id)
        buf.append(frame)

        detections: List[dict] = []
        alerts: List[dict]     = []
        confidence             = {}

        # ── 1. Person detection ───────────────────────────────────────────────
        persons = self.person.detect(frame)
        for p in persons:
            detections.append({"label": "person", "confidence": p["conf"],
                                "bbox": p["bbox"]})

        # ── 2. Violence detection (needs full buffer) ─────────────────────────
        if len(buf) == self.FRAME_BUFFER_LEN:
            v_conf = self.violence.predict(list(buf))
            confidence["violence"] = round(float(v_conf), 2)
            if v_conf > 0.60:
                alerts.append({
                    "type": "violence", "severity": "high",
                    "message": f"Violence detected ({v_conf:.0%})",
                })
                detections.append({"label": "violence", "confidence": float(v_conf),
                                    "bbox": None})

        # ── 3. Fall detection ─────────────────────────────────────────────────
        fall_result = self.fall.detect(frame)
        confidence["fall_collapse"] = round(fall_result["confidence"], 2)
        if fall_result["fallen"]:
            alerts.append({
                "type": "fall", "severity": "high",
                "message": f"Fall/Collapse detected ({fall_result['confidence']:.0%})",
            })
            detections.append({"label": "fall", "confidence": fall_result["confidence"],
                                "bbox": fall_result.get("bbox")})

        # ── 4. Chase detection ────────────────────────────────────────────────
        chase_result = self.chase.update(frame, persons)
        confidence["chasing"] = round(chase_result["confidence"], 2)
        if chase_result["chasing"]:
            alerts.append({
                "type": "chase", "severity": "medium",
                "message": f"Chasing behaviour detected ({chase_result['confidence']:.0%})",
            })

        # ── 5. Hand gesture SOS ───────────────────────────────────────────────
        sos_result = self.gesture.detect(frame)
        if sos_result["sos_detected"]:
            alerts.append({
                "type": "gesture_sos", "severity": "critical",
                "message": "Silent SOS hand gesture detected!",
            })

        # ── 6. Audio keyword ─────────────────────────────────────────────────
        if self.audio.keyword_detected():
            alerts.append({
                "type": "audio_sos", "severity": "critical",
                "message": "Whisper 'Help' keyword detected via microphone.",
            })

        return {
            "detections": detections,
            "alerts":     alerts,
            "confidence": confidence,
        }

    def _get_buffer(self, camera_id: str) -> deque:
        if camera_id not in self._buffers:
            self._buffers[camera_id] = deque(maxlen=self.FRAME_BUFFER_LEN)
        return self._buffers[camera_id]
