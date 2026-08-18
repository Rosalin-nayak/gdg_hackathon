# SurviLens Architecture

Honest map of what exists today vs what is planned.

## System overview

```
Browser webcam
    → Frontend (React) captures JPEG frames ~every 3s
    → Backend POST /detect (proxy)
    → ML POST /detect/frame (YOLO + detectors)
    → ML notifier POST /alerts (x-service-key)
    → Backend inserts incident in Postgres
    → Socket.IO emits incident:new / incident:updated
    → Dashboard updates live
```

## Services

| Service | Path | Port | Role |
|---------|------|------|------|
| Frontend | `frontend/` | 5173 | Dashboard + webcam capture |
| Backend | `backend/` | 4000 | REST API, Socket.IO, ML proxy |
| ML | `ml_services/` | 8000 | Frame detection + alert notify |
| Postgres | `docker-compose.yml` → `db` | 5433→5432 | Persistent store |

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

## Data storage (Postgres)

Schema: `backend/sql/schema.sql` (applied on backend startup)

| Table | Purpose |
|-------|---------|
| `cameras` | Seeded CAM_01 / CAM_02 / CAM_03 |
| `incidents` | Detected / verified / dispatched / resolved events |
| `responders` | Dispatch roster; auto-assign on new incident when available |

Backend modules:
- `src/db/pool.js` — connection pool
- `src/db/migrate.js` — schema + camera seed
- `src/db/mappers.js` — DB rows → API shapes

`GET /health` reports `"database":"up"` when Postgres is reachable.

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
- Twilio / Firebase (until implemented as a complete slice)
- Full multi-service Docker image set (DB compose only for now)

## Health checks

- `GET http://localhost:4000/health`
- `GET http://localhost:8000/health`
