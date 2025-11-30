require('dotenv').config();

// Conexión a la BD
const mysql = require("mysql2/promise");

async function getConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });
  return connection;
}

module.exports = getConnection;
