# SurviLens Architecture

Honest map of what exists today vs what is planned.

## System overview

```
Browser webcam
    → Frontend (React) captures JPEG frames ~every 3s
    → Backend POST /detect (proxy)
    → ML POST /detect/frame (YOLO + detectors)
    → ML notifier POST /alerts (x-service-key)
    → Backend creates in-memory incident
    → Socket.IO emits incident:new / incident:updated
    → Dashboard updates live
```

## Services

| Service | Path | Port | Role |
|---------|------|------|------|
| Frontend | `frontend/` | 5173 | Dashboard + webcam capture |
| Backend | `backend/` | 4000 | REST API, Socket.IO, ML proxy |
| ML | `ml_services/` | 8000 | Frame detection + alert notify |

## Primary ML path

**Mounted:** `POST /detect/frame` in `ml_services/routes/detect.py`

Detectors used on that path:
- Person (YOLO / HOG)
- Behaviour (YOLO classes)
- Violence (demo mode without weights)
- Fall (MediaPipe Pose)
- Gesture / SOS (MediaPipe Hands)
- Chase (centroid tracker)
- Audio keyword (demo mode without weights)

## Experimental / not mounted

| File | Status |
|------|--------|
| `ml_services/routes/stream.py` | WebSocket stream sketch; **not** included in `main.py` |
| `ml_services/pipeline.py` | Unified pipeline sketch; **not** imported |

## Data storage

Incidents, cameras, and responders are **in-memory** on the backend process.
Restarting the backend clears state. Database persistence is the next production step.

## Auth model today

- **ML → Backend:** shared `INTERNAL_SERVICE_KEY` via `x-service-key` on `/alerts`
- **Browser → Backend:** open (no user auth yet)
- Dashboard SOS uses `POST /incidents` (operator-side; needs auth later)

## Frontend structure

```
frontend/src/
  pages/DashboardPage.jsx     # single app page
  components/Cameras/         # camera list + webcam overlay
  components/Dashboard/       # stats, schematic map, Google Maps
  components/Responders/      # list from GET /responders
  components/SOS/             # manual incident triggers
  store/incidentStore.js      # Zustand: incidents, alerts, stats
  hooks/useSocket.js          # incident:new / incident:updated
  api/                        # axios clients
```

## Explicit non-goals (current phase)

- Real CCTV / RTSP ingestion (webcam only)
- User login / RBAC
- Persistent DB
- Twilio / Firebase (removed as unused deps until implemented)

## Health checks

- `GET http://localhost:4000/health`
- `GET http://localhost:8000/health`
