from collections import deque

class FrameBuffer:
    def __init__(self, size=30):
        self.buffer = deque(maxlen=size)

    def add(self, frame):
        self.buffer.append(frame)

    def get_all(self):
        return list(self.buffer)