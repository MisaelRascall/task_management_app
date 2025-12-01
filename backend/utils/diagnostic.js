require("dotenv").config();
const mysql = require("mysql2/promise");

async function testDbConnection() {
  console.log("🔎 Comprobando BD...");

  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    await conn.end();
    console.log("✅ Conexión MySQL exitosa");
  } catch (err) {
    console.error("❌ Error conectando a MySQL:", err.message);
  }
}

testDbConnection();
