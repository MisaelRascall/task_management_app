const express = require("express");
const router = express.Router();
const getConnection = require("../config/db");

// Obtener una lista de las tareas con sus detalles
router.get("/", async (req, res) => {
    try {
        const conn = await getConnection();
        const [rows] = await conn.query(`
            SELECT t.id, t.titulo, t.descripcion, t.estado,
            DATE_FORMAT(t.fecha, '%d-%m-%Y') AS fecha,
            u.nombre AS responsable
            FROM tasks t
            INNER JOIN users u ON t.id_user = u.id`);
        await conn.end();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Nuevo endpoint — tareas para responsable por nombre
router.get("/byUserName", async (req, res) => {
    console.log("entrando al endpoint ByUserName");
    const nombre = req.query.nombre;  // recibimos nombre por query string
    if (!nombre) {
        return res.status(400).json({ error: "Falta el parámetro 'nombre'" });
    }

    try {
        const conn = await getConnection();
        const [rows] = await conn.query(`
      SELECT t.id, t.titulo, t.descripcion, t.estado,
             DATE_FORMAT(t.fecha, '%d-%m-%Y') AS fecha,
             u.nombre AS responsable
      FROM tasks t
      INNER JOIN users u ON t.id_user = u.id
      WHERE u.nombre = ?`, [nombre]);
        await conn.end();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener una sola tarea
router.get("/:id", async (req, res) => {
    console.log("entrando al endpoint Tasks/id");
    const taskId = parseInt(req.params.id, 10);

    // console.log("ID recibido:", req.params.id, " -> convertido a número:", userId);

    // Valida si el ID es un número y no una letra
    if (isNaN(taskId)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const conn = await getConnection();
        const [rows] = await conn.query(`
            SELECT t.id, t.titulo, t.descripcion, t.estado,
            DATE_FORMAT(t.fecha, '%d-%m-%Y') AS fecha,
            u.nombre AS responsable
            FROM tasks t
            INNER JOIN users u ON t.id_user = u.id
            WHERE t.id = ?`, [taskId]);
        await conn.end();

        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Crear una sola tarea
router.post("/", async (req, res) => {
    // console.log("Body recibido:", req.body);

    const { titulo, descripcion, id_user, fecha } = req.body;

    if (!titulo || !descripcion || !id_user || !fecha) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Transformando el formato de fecha de "DD-MM-YYYY" a "YYYY-MM-DD"
    const [dia, mes, anio] = fecha.split("-");
    const fechaSQL = `${anio}-${mes}-${dia}`;

    try {
        const conn = await getConnection();
        const [result] = await conn.query(
            "INSERT INTO tasks (titulo, descripcion, id_user, fecha) VALUES (?, ?, ?, ?)", [titulo, descripcion, id_user, fechaSQL]
        );
        await conn.end();

        res.status(201).json({ id: result.insertId, titulo, descripcion, id_user, fechaSQL });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar tarea
router.put("/:id", async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { titulo, descripcion, id_user, fecha } = req.body;

    if (!titulo || !descripcion || !id_user || !fecha) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // Transformando el formato de fecha de "DD-MM-YYYY" a "YYYY-MM-DD"
    const [dia, mes, anio] = fecha.split("-");
    const fechaSQL = `${anio}-${mes}-${dia}`;

    try {
        const conn = await getConnection();
        const [result] = await conn.query(
            `UPDATE tasks SET titulo = ?, descripcion = ?, id_user = ?, fecha = ? WHERE id = ?`, [titulo, descripcion, id_user, fechaSQL, taskId]
        );
        await conn.end();

        if (result.affectedRows > 0) {
            res.json({ id: req.params.id, titulo, descripcion, id_user, fecha });
        } else {
            res.status(400).json({ error: "Tarea no encontrada" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar una tarea
router.delete("/:id", async (req, res) => {
    const taskId = parseInt(req.params.id, 10);

    // Muestra el contenido de req.data recomendado solo en modo desarrollo
    // console.log("ID recibido:", req.params.id, " -> convertido a número:", taskId);

    // Valido si el ID es un número
    if (isNaN(taskId)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    try {
        const conn = await getConnection();
        const [result] = await conn.query("DELETE FROM tasks WHERE id = ?", [taskId]);

        if (result.affectedRows > 0) {
            res.json({ mensaje: "Tarea eliminada" });
        } else {
            res.status(404).json({ error: "Tarea no encontrada" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router