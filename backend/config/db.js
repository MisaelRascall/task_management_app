// Conexión a la BD
const mysql = require("mysql2/promise");

async function getConnection() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "invitado",
    password: "pass",
    database: "tasks_manager"
  });
  return connection;
}

module.exports = getConnection;
