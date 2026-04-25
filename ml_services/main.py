from fastapi import FastAPI
from routes import detect,stream

app = FastAPI(title="ML Emergency Detection Service")

app.include_router(detect.router)
app.include_router(stream.router)

@app.get("/")
def root():
    return {"status": "ML Service running"}