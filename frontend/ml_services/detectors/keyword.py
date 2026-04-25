import numpy as np
def detect_keyword(audio_chunk: bytes):
    alerts=[]
    audio=np.frombuffer(audio_chunk, dtype=np.int16)
    if len(audio)==0:
        return alerts
    audio=audio/32768.0
    energy=np.mean(audio**2)
    if energy>0.02:
        alerts.append("loud_sound")
    peaks=np.sum(np.abs(audio)>0.6)
    if peaks>50:
        alerts.append("shouting_pattern")
    return alerts
