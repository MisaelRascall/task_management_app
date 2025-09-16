    const express = require('express');
    const app = express();
    const port = 3001; // Puedes elegir otro puerto

    app.use(express.json()); // Para interpretar JSON en las solicitudes

    // Define tu primera ruta de API
    app.get('/api/saludo', (req, res) => {
      res.json({ mensaje: '¡Hola desde el backend!' });
    });

    app.listen(port, () => {
      console.log(`Servidor Express escuchando en el puerto ${port}`);
    });