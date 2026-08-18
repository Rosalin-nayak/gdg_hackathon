const { query } = require("../db/pool");
const { mapCamera } = require("../db/mappers");

const getCameras = async () => {
  const result = await query(`SELECT * FROM cameras ORDER BY id ASC`);
  return result.rows.map(mapCamera);
};

module.exports = { getCameras };
