const fs = require("fs");
const path = require("path");
const { query } = require("./pool");

const DEFAULT_CAMERAS = [
  { id: "CAM_01", zone: "Lobby", lat: null, lng: null },
  { id: "CAM_02", zone: "Entrance", lat: null, lng: null },
  { id: "CAM_03", zone: "Parking", lat: null, lng: null },
];

const migrate = async () => {
  const schemaPath = path.join(__dirname, "../../sql/schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");
  await query(sql);
};

const seedCameras = async () => {
  for (const cam of DEFAULT_CAMERAS) {
    await query(
      `INSERT INTO cameras (id, zone, lat, lng)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [cam.id, cam.zone, cam.lat, cam.lng]
    );
  }
};

const initDb = async () => {
  await migrate();
  await seedCameras();
};

module.exports = { migrate, seedCameras, initDb, DEFAULT_CAMERAS };
