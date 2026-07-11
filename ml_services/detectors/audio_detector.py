"""
AudioDetector — Real-time microphone listener for distress keyword "help".

Pipeline:
  1. Continuously record 1-second audio chunks in a background thread.
  2. Extract 40-band MFCC features (librosa).
  3. Run a lightweight 2D CNN trained on Google Speech Commands +
     custom "help/whisper" recordings.
  4. If confidence > threshold, set a thread-safe flag read by pipeline.

Weights: ml_services/weights/audio_cnn.pt
Training data: Google Speech Commands dataset + 
               custom "help" whisper recordings (positive class).
"""

import logging
import threading
import queue
import os
import numpy as np
import torch
import torch.nn as nn

logger = logging.getLogger(__name__)

SAMPLE_RATE   = 16000
CHUNK_SECS    = 1
N_MFCC        = 40
AUDIO_THRESH  = 0.75
WEIGHTS_PATH  = os.path.join(os.path.dirname(__file__), "weights", "audio_cnn.pt")


# ── Model ─────────────────────────────────────────────────────────────────────

class AudioCNN(nn.Module):
    """Small 2D-CNN on MFCC spectrograms for keyword spotting."""
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(1, 16, 3, padding=1), nn.BatchNorm2d(16), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(), nn.MaxPool2d(2),
            nn.Conv2d(32, 64, 3, padding=1), nn.BatchNorm2d(64), nn.ReLU(),
            nn.AdaptiveAvgPool2d((4, 4)),
        )
        self.fc = nn.Sequential(
            nn.Flatten(),
            nn.Linear(64*4*4, 128), nn.ReLU(), nn.Dropout(0.3),
            nn.Linear(128, 1), nn.Sigmoid(),
        )

    def forward(self, x):   # x: (B, 1, N_MFCC, T)
        return self.fc(self.conv(x))


# ── Detector ──────────────────────────────────────────────────────────────────

class AudioDetector:
    def __init__(self):
        self.model     = None
        self.device    = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._detected = threading.Event()
        self._running  = False
        self._demo     = True

    def load(self):
        self.model = AudioCNN().to(self.device)
        self.model.eval()

        if os.path.exists(WEIGHTS_PATH):
            state = torch.load(WEIGHTS_PATH, map_location=self.device)
            self.model.load_state_dict(state)
            self._demo = False
            logger.info("AudioDetector: weights loaded.")
        else:
            logger.warning("AudioDetector: no weights found — demo mode.")

        # Start background listening thread
        self._running = True
        t = threading.Thread(target=self._listen_loop, daemon=True)
        t.start()

    def keyword_detected(self) -> bool:
        """Non-blocking check — clears the flag after reading."""
        fired = self._detected.is_set()
        if fired:
            self._detected.clear()
        return fired

    # ── Background listening ──────────────────────────────────────────────────

    def _listen_loop(self):
        if self._demo:
            self._demo_loop()
            return
        try:
            import sounddevice as sd
            import librosa
            logger.info("AudioDetector: microphone listener started.")
            while self._running:
                audio = sd.rec(
                    int(CHUNK_SECS * SAMPLE_RATE),
                    samplerate=SAMPLE_RATE, channels=1, dtype="float32"
                )
                sd.wait()
                audio = audio.flatten()
                conf  = self._predict(audio)
                if conf > AUDIO_THRESH:
                    logger.warning(f"Keyword 'help' detected! conf={conf:.2f}")
                    self._detected.set()
        except Exception as e:
            logger.error(f"AudioDetector listen loop error: {e}")

    def _demo_loop(self):
        """Occasionally fire a fake keyword event for demo/testing."""
        import time, random
        while self._running:
            time.sleep(random.uniform(30, 120))   # every 30-120s
            logger.info("AudioDetector [DEMO]: simulating keyword trigger.")
            self._detected.set()

    def _predict(self, audio: np.ndarray) -> float:
        try:
            import librosa
            mfcc = librosa.feature.mfcc(y=audio, sr=SAMPLE_RATE, n_mfcc=N_MFCC)
            # Pad/trim to fixed width
            target_len = 32
            if mfcc.shape[1] < target_len:
                mfcc = np.pad(mfcc, ((0,0),(0, target_len-mfcc.shape[1])))
            else:
                mfcc = mfcc[:, :target_len]
            t = torch.tensor(mfcc[np.newaxis, np.newaxis, :, :],
                             dtype=torch.float32).to(self.device)
            with torch.no_grad():
                return float(self.model(t).item())
        except Exception as e:
            logger.error(f"AudioDetector predict error: {e}")
            return 0.0


# ── Training script ───────────────────────────────────────────────────────────
# python audio_detector.py --train --data_dir /path/to/audio_data

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--train",    action="store_true")
    parser.add_argument("--data_dir", default="data/audio")
    parser.add_argument("--epochs",   type=int, default=30)
    args = parser.parse_args()

    if args.train:
        import glob, torch.optim as optim
        from torch.utils.data import Dataset, DataLoader
        import librosa

        class AudioDataset(Dataset):
            """
            data_dir/
              help/   *.wav  (positive: distress keyword)
              other/  *.wav  (negative: background / other words)
            """
            def __init__(self, root):
                self.files  = []
                self.labels = []
                for label, folder in [(1,"help"), (0,"other")]:
                    for f in glob.glob(os.path.join(root, folder, "*.wav")):
                        self.files.append(f)
                        self.labels.append(label)

            def __len__(self): return len(self.files)

            def __getitem__(self, idx):
                y, sr = librosa.load(self.files[idx], sr=SAMPLE_RATE, duration=CHUNK_SECS)
                mfcc  = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=N_MFCC)
                if mfcc.shape[1] < 32:
                    mfcc = np.pad(mfcc, ((0,0),(0,32-mfcc.shape[1])))
                else:
                    mfcc = mfcc[:, :32]
                t = torch.tensor(mfcc[np.newaxis, :, :], dtype=torch.float32)
                return t, torch.tensor(self.labels[idx], dtype=torch.float32)

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model  = AudioCNN().to(device)
        ds     = AudioDataset(args.data_dir)
        dl     = DataLoader(ds, batch_size=16, shuffle=True)
        opt    = optim.Adam(model.parameters(), lr=1e-3)
        loss_fn= nn.BCELoss()

        for ep in range(args.epochs):
            model.train(); total_loss = 0
            for X, y in dl:
                X, y = X.to(device), y.to(device)
                pred = model(X).squeeze(1)
                loss = loss_fn(pred, y)
                opt.zero_grad(); loss.backward(); opt.step()
                total_loss += loss.item()
            print(f"Epoch {ep+1}/{args.epochs}  loss={total_loss/len(dl):.4f}")

        os.makedirs("weights", exist_ok=True)
        torch.save(model.state_dict(), WEIGHTS_PATH)
        print(f"Saved → {WEIGHTS_PATH}")
