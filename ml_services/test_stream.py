import cv2
import websockets
import asyncio

async def stream():
    uri = "ws://127.0.0.1:8000/stream/test_cam"
    print("Connecting to WebSocket...")
    async with websockets.connect(uri) as websocket:
        print("Connected!")
        cap = cv2.VideoCapture(0)

        if not cap.isOpened():
            print("Camera not working")
            return

        print("Camera started")

        while True:
            ret, frame = cap.read()

            if not ret:
                print("Frame not captured")
                break

            print("Sending frame...")

            _, buffer = cv2.imencode('.jpg', frame)

            await websocket.send(buffer.tobytes())

            print("Waiting for response...")

            response = await websocket.recv()

            print("Response:", response)

asyncio.run(stream())