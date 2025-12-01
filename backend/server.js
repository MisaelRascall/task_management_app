require("dotenv").config(); // Cargando variables de entorno

const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json()); // Para interpretar JSON en las solicitudes

try {
    // Ruta de prueba
  app.get("/", (req, res) => {
    res.send("API REST con Express funcionando 🚀")
  });

  // Define tu primera ruta de API
  app.get('/api/saludo', (req, res) => {
    res.json({ mensaje: '¡Hola desde el backend!' });
  });

  // Importando las rutas de usuarios
  const usersRoutes = require("./routes/users");
  app.use("/users", usersRoutes);

  // Importando las rutas de las tareas
  const tasksRoutes = require("./routes/tasks");
  app.use("/tasks", tasksRoutes);

  // Importando la ruta del status desde tareas
  const statusRoutes = require("./routes/status");
  app.use("/status", statusRoutes);

  console.log("¡Mapeando endpoints con exito!")
} catch (err) {
  console.log.error("Error al importar las rutas: ", err);
}

// Levantando el servidor
app.listen(port, "0.0.0.0", () => {
  console.log(`El servidor Express esta corriendo en http://localhost:${port}`);
});