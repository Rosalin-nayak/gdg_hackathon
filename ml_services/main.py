from fastapi import FastAPI
import os
from dotenv import load_dotenv

from routes import detect

load_dotenv()

app = FastAPI(title="ML Emergency Detection Service")

# Primary path: webcam frames via backend proxy → POST /detect/frame
app.include_router(detect.router)


@app.get("/")
def root():
    return {"status": "ML Service running"}


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "ml",
        "serviceKeyConfigured": bool(os.getenv("INTERNAL_SERVICE_KEY")),
        "backendUrl": os.getenv("BACKEND_URL", "http://localhost:4000/alerts"),
        "primaryRoute": "/detect/frame",
    }
