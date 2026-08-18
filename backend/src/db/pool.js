const { Pool } = require("pg");

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://survilens:survilens@localhost:5432/survilens";

const pool = new Pool({
  connectionString: DATABASE_URL,
});

const query = (text, params) => pool.query(text, params);

const getClient = () => pool.connect();

const checkConnection = async () => {
  const result = await pool.query("SELECT 1 AS ok");
  return result.rows[0]?.ok === 1;
};

module.exports = {
  pool,
  query,
  getClient,
  checkConnection,
  DATABASE_URL,
};
