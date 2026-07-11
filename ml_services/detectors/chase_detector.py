"""
ChaseDetector — Multi-person tracker + trajectory analysis.

Algorithm:
  1. Track every person across frames using a simple centroid tracker
     (swap for deep_sort_realtime for production).
  2. Build velocity vectors per track.
  3. Detect chase: two tracks where one person consistently moves
     toward the other at speed > threshold for N frames.
"""

import logging
import numpy as np
from typing import List, Dict, Any
from collections import deque, defaultdict

logger = logging.getLogger(__name__)

CHASE_FRAMES     = 20    # consecutive frames to confirm chase
SPEED_THRESHOLD  = 5.0   # pixels/frame average speed
APPROACH_ANGLE   = 45    # degrees — pursuer must face target within this cone


class SimpleTracker:
    """IoU-based centroid tracker — replace with DeepSORT for production."""
    def __init__(self, max_lost=10):
        self.next_id  = 0
        self.tracks   = {}   # id → {"centroid": (cx,cy), "lost": int, "history": deque}
        self.max_lost = max_lost

    def update(self, detections: List[Dict]) -> Dict[int, np.ndarray]:
        """Returns {track_id: centroid_array}."""
        centroids = [self._centroid(d["bbox"]) for d in detections if d.get("bbox")]

        if not self.tracks:
            for c in centroids:
                self._new_track(c)
        else:
            # Greedy nearest-neighbour assignment
            used_det = set(); used_trk = set()
            trk_ids  = list(self.tracks.keys())
            trk_ctrs = [self.tracks[t]["centroid"] for t in trk_ids]

            for ci, c in enumerate(centroids):
                best_dist = float("inf"); best_tid = None
                for ti, tc in enumerate(trk_ctrs):
                    if ti in used_trk:
                        continue
                    d = np.linalg.norm(c - tc)
                    if d < best_dist:
                        best_dist = d; best_tid = ti
                if best_tid is not None and best_dist < 80:
                    tid = trk_ids[best_tid]
                    self.tracks[tid]["centroid"] = c
                    self.tracks[tid]["lost"]     = 0
                    self.tracks[tid]["history"].append(c)
                    used_det.add(ci); used_trk.add(best_tid)

            for ci, c in enumerate(centroids):
                if ci not in used_det:
                    self._new_track(c)

            # Age out lost tracks
            lost_ids = []
            for tid in trk_ids:
                if tid not in [trk_ids[i] for i in used_trk]:
                    self.tracks[tid]["lost"] += 1
                if self.tracks[tid]["lost"] > self.max_lost:
                    lost_ids.append(tid)
            for tid in lost_ids:
                del self.tracks[tid]

        return {tid: t["centroid"] for tid, t in self.tracks.items()}

    def _centroid(self, bbox):
        x1,y1,x2,y2 = bbox
        return np.array([(x1+x2)/2, (y1+y2)/2])

    def _new_track(self, centroid):
        self.tracks[self.next_id] = {
            "centroid": centroid,
            "lost":     0,
            "history":  deque(maxlen=CHASE_FRAMES),
        }
        self.tracks[self.next_id]["history"].append(centroid)
        self.next_id += 1

    def get_history(self, track_id: int) -> deque:
        return self.tracks[track_id]["history"]


class ChaseDetector:
    def __init__(self):
        self.tracker       = SimpleTracker()
        self._chase_history: deque = deque(maxlen=CHASE_FRAMES)

    def load(self):
        logger.info("ChaseDetector: ready (centroid tracker).")

    def update(self, frame: np.ndarray, persons: List[Dict]) -> Dict[str, Any]:
        """
        persons : list of {bbox, conf} from PersonDetector.
        Returns: {chasing: bool, confidence: float}
        """
        tracks = self.tracker.update(persons)

        if len(tracks) < 2:
            self._chase_history.append(False)
            return {"chasing": False, "confidence": 0.0}

        chase_detected = False
        max_conf       = 0.0

        tids  = list(tracks.keys())
        ctrs  = list(tracks.values())

        for i in range(len(tids)):
            for j in range(len(tids)):
                if i == j:
                    continue
                hist_i = self.tracker.get_history(tids[i])
                hist_j = self.tracker.get_history(tids[j])

                if len(hist_i) < 5 or len(hist_j) < 5:
                    continue

                # Vector from i to j
                direction_to_j = ctrs[j] - ctrs[i]
                dist = np.linalg.norm(direction_to_j)
                if dist < 1:
                    continue

                # Velocity of i (pursuer)
                vel_i = np.array(hist_i[-1]) - np.array(hist_i[-5])
                speed_i = np.linalg.norm(vel_i)

                if speed_i < SPEED_THRESHOLD:
                    continue

                # Is i moving toward j?
                angle = np.degrees(np.arccos(
                    np.clip(np.dot(vel_i, direction_to_j) /
                            (np.linalg.norm(vel_i) * dist + 1e-8), -1, 1)
                ))
                if angle < APPROACH_ANGLE:
                    # Is j also moving (fleeing)?
                    vel_j   = np.array(hist_j[-1]) - np.array(hist_j[-5])
                    speed_j = np.linalg.norm(vel_j)
                    conf    = min(1.0, (speed_i / 30) * 0.6 + (1 - angle / 90) * 0.4)

                    if conf > max_conf:
                        max_conf       = conf
                        chase_detected = True

        self._chase_history.append(chase_detected)
        confirmed = sum(self._chase_history) >= CHASE_FRAMES // 2

        return {
            "chasing":    confirmed,
            "confidence": round(max_conf, 2) if confirmed else 0.0,
        }
