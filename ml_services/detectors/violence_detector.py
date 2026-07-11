"""
ViolenceDetector — Temporal 3D-CNN (C3D-style) for violence detection.

Architecture:
  Input  : (1, 3, 16, 112, 112)  — batch=1, RGB, 16 frames, 112×112
  Conv3D blocks × 4  →  MaxPool3D
  AdaptiveAvgPool  →  FC(512) → Dropout → FC(1) → Sigmoid

Training dataset:
  Hockey Fight Dataset + RWF-2000 (Violence / Non-Violence)
  Fine-tune from a pre-trained C3D/SlowFast checkpoint.

At inference time, if a real pre-trained .pt file is not present
we return a random confidence for demo purposes (replace with your
trained weights file).
"""

import logging
import os
import numpy as np
import torch
import torch.nn as nn
import cv2

logger = logging.getLogger(__name__)

WEIGHTS_PATH = os.path.join(os.path.dirname(__file__), "weights", "violence_c3d.pt")


# ── Model Architecture ────────────────────────────────────────────────────────

class Conv3DBlock(nn.Module):
    def __init__(self, in_ch, out_ch, kernel=(3,3,3), padding=1):
        super().__init__()
        self.block = nn.Sequential(
            nn.Conv3d(in_ch, out_ch, kernel, padding=padding),
            nn.BatchNorm3d(out_ch),
            nn.ReLU(inplace=True),
            nn.MaxPool3d((1,2,2)),
        )

    def forward(self, x):
        return self.block(x)


class ViolenceC3D(nn.Module):
    """Lightweight C3D for binary violence classification."""
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            Conv3DBlock(3,  32),
            Conv3DBlock(32, 64),
            Conv3DBlock(64, 128),
            Conv3DBlock(128, 256),
        )
        self.pool    = nn.AdaptiveAvgPool3d((1,1,1))
        self.classifier = nn.Sequential(
            nn.Flatten(),
            nn.Linear(256, 512),
            nn.ReLU(inplace=True),
            nn.Dropout(0.5),
            nn.Linear(512, 1),
            nn.Sigmoid(),
        )

    def forward(self, x):
        x = self.features(x)
        x = self.pool(x)
        return self.classifier(x)


# ── Detector ──────────────────────────────────────────────────────────────────

class ViolenceDetector:
    FRAME_SIZE = (112, 112)

    def __init__(self):
        self.model  = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._demo  = True   # flip to False once real weights are placed

    def load(self):
        self.model = ViolenceC3D().to(self.device)
        self.model.eval()

        if os.path.exists(WEIGHTS_PATH):
            state = torch.load(WEIGHTS_PATH, map_location=self.device)
            self.model.load_state_dict(state)
            self._demo = False
            logger.info(f"ViolenceDetector: weights loaded from {WEIGHTS_PATH}")
        else:
            logger.warning(
                "ViolenceDetector: no weights found at ml_services/weights/violence_c3d.pt"
                " — running in DEMO mode (random confidence)."
            )

    def predict(self, frames: list) -> float:
        """
        frames : list of 16 BGR numpy arrays
        returns: float confidence in [0,1]
        """
        if self._demo:
            # Demo: simulate increasing confidence near noon UTC
            import random
            return round(random.uniform(0.40, 0.92), 2)

        tensor = self._preprocess(frames)
        with torch.no_grad():
            out = self.model(tensor)
        return float(out.item())

    def _preprocess(self, frames: list) -> torch.Tensor:
        """BGR frames → (1, 3, T, H, W) float32 tensor normalised to [-1,1]."""
        processed = []
        for f in frames:
            f_rgb = cv2.cvtColor(f, cv2.COLOR_BGR2RGB)
            f_res = cv2.resize(f_rgb, self.FRAME_SIZE).astype(np.float32) / 127.5 - 1.0
            processed.append(f_res.transpose(2,0,1))   # (3, H, W)

        t = torch.tensor(np.stack(processed), dtype=torch.float32)   # (T, 3, H, W)
        t = t.permute(1, 0, 2, 3).unsqueeze(0)                       # (1, 3, T, H, W)
        return t.to(self.device)


# ── Training helper (run standalone) ─────────────────────────────────────────
# python violence_detector.py --train --data_dir /path/to/violence_dataset

if __name__ == "__main__":
    import argparse, torch.optim as optim
    from torch.utils.data import DataLoader, Dataset
    from torchvision import transforms

    parser = argparse.ArgumentParser()
    parser.add_argument("--train",    action="store_true")
    parser.add_argument("--data_dir", default="data/violence")
    parser.add_argument("--epochs",   type=int, default=20)
    parser.add_argument("--lr",       type=float, default=1e-4)
    args = parser.parse_args()

    if args.train:
        class ViolenceDataset(Dataset):
            """
            Expects:
              data_dir/
                violence/   *.mp4 / *.avi
                non_violence/ *.mp4 / *.avi
            """
            def __init__(self, root, n_frames=16):
                import glob
                self.clips  = []
                self.labels = []
                for label, folder in [(1,"violence"),(0,"non_violence")]:
                    for path in glob.glob(os.path.join(root, folder, "*")):
                        self.clips.append(path)
                        self.labels.append(label)
                self.n_frames = n_frames

            def __len__(self): return len(self.clips)

            def _load_clip(self, path):
                cap = cv2.VideoCapture(path)
                frames = []
                total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                step  = max(1, total // self.n_frames)
                for i in range(self.n_frames):
                    cap.set(cv2.CAP_PROP_POS_FRAMES, i * step)
                    ok, f = cap.read()
                    if not ok:
                        f = np.zeros((112,112,3), np.uint8)
                    f = cv2.cvtColor(f, cv2.COLOR_BGR2RGB)
                    f = cv2.resize(f, (112,112)).astype(np.float32) / 127.5 - 1.0
                    frames.append(f.transpose(2,0,1))
                cap.release()
                t = torch.tensor(np.stack(frames))     # (T, 3, H, W)
                return t.permute(1, 0, 2, 3).float()   # (3, T, H, W)

            def __getitem__(self, idx):
                return self._load_clip(self.clips[idx]), torch.tensor(self.labels[idx], dtype=torch.float32)

        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model  = ViolenceC3D().to(device)
        ds     = ViolenceDataset(args.data_dir)
        dl     = DataLoader(ds, batch_size=4, shuffle=True, num_workers=2)
        opt    = optim.Adam(model.parameters(), lr=args.lr)
        loss_fn = nn.BCELoss()

        for epoch in range(args.epochs):
            model.train()
            total_loss = 0
            for clips, labels in dl:
                clips, labels = clips.to(device), labels.to(device)
                pred = model(clips).squeeze(1)
                loss = loss_fn(pred, labels)
                opt.zero_grad()
                loss.backward()
                opt.step()
                total_loss += loss.item()
            print(f"Epoch {epoch+1}/{args.epochs}  loss={total_loss/len(dl):.4f}")

        os.makedirs("weights", exist_ok=True)
        torch.save(model.state_dict(), WEIGHTS_PATH)
        print(f"Saved → {WEIGHTS_PATH}")
