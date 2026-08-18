require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const { initDb } = require("./db/migrate");
const { checkConnection } = require("./db/pool");

const upload = multer();

const app = express();
const server = http.createServer(app);

const ML_URL = process.env.ML_URL || "http://localhost:8000";
const SERVICE_KEY = process.env.INTERNAL_SERVICE_KEY;

if (!SERVICE_KEY) {
  console.warn(
    "WARNING: INTERNAL_SERVICE_KEY is not set. /alerts will reject all requests until it is configured."
  );
}

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "10mb" }));

const incidentRoutes = require("./routes/incidentsRoutes");
app.use("/incidents", incidentRoutes);

const cameraRoutes = require("./routes/cameraRoutes");
app.use("/cameras", cameraRoutes);

const responderRoutes = require("./routes/respondersRoutes");
app.use("/responders", responderRoutes);

const alertRoutes = require("./routes/alertsRoutes");
app.use("/alerts", alertRoutes);

app.get("/health", async (req, res) => {
  let database = "down";
  try {
    database = (await checkConnection()) ? "up" : "down";
  } catch {
    database = "down";
  }

  res.status(database === "up" ? 200 : 503).json({
    status: database === "up" ? "ok" : "degraded",
    service: "backend",
    mlUrl: ML_URL,
    serviceKeyConfigured: Boolean(SERVICE_KEY),
    database,
  });
});

app.get("/test", (req, res) => {
  res.json({ message: "Hello World!" });
});

const { initSocket } = require("./sockets/socketServer");
initSocket(server);

app.post("/detect", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file received" });
    }

    const cameraId = req.body.cameraId || "CAM_01";

    const formData = new FormData();
    formData.append("file", file.buffer, {
      filename: "frame.jpg",
      contentType: "image/jpeg",
    });
    formData.append("camera_id", cameraId);

    const response = await fetch(`${ML_URL}/detect/frame`, {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Detect proxy failed:", err.message);
    res.status(500).json({ error: "Detection failed" });
  }
});

const PORT = process.env.PORT || 4000;

const start = async () => {
  try {
    await initDb();
    console.log("Postgres schema ready");
  } catch (err) {
    console.error("Failed to initialize Postgres:", err.message);
    console.error(
      "Start the database with: docker compose up -d db  (from repo root)"
    );
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

start();
