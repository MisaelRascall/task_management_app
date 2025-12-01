require('dotenv').config();

const mysql = require("mysql2/promise");

async function getConnection() {
  try {
      const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    return connection;

  } catch (err) {
    console.error("Error conectando a la DB: ", err.message);
    throw err;    
  }
}

module.exports = getConnection;
