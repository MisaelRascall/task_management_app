const express = require("express");
const router = express.Router();
const getConnection = require("../config/db");
const { route } = require("./users");

// Obtener una lista de las tareas con sus detalles
router.get("/", async (req, res) => {
    try {
        const conn = await getConnection();
        const [rows] = await conn.query("SELECT * FROM tasks");
        await conn.end();
        res.json(rows);
    } catch (err) {
        res.status(500).json({error: err.message });
    }
});

// Obtener una sola tarea
router.get("/:id", async (req, res) => {
    const taskId = parseInt(req.params.id, 10);

    // console.log("ID recibido:", req.params.id, " -> convertido a número:", userId);

    // Valida si el ID es un número y no una letra
    if (isNaN(taskId)) {
        return res.status(400).json({error: "ID inválido" });
    }

    try {
        const conn = await getConnection();
        const [rows] = await conn.query("SELECT * FROM tasks WHERE id = ?", [taskId]);
        await conn.end();

        if (rows.length >0) {
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
    res.send(req.body);

    // console.log("Body recibido:", req.body);

    const { titulo, descripcion, responsable, fecha} = req.body;

    if (!titulo || !descripcion || !responsable || !fecha) {
        return res.status(400).json({ error: "Faltan campos obligatorios"});
    }

    try{
        const conn = await getConnection();
        const [result] = await conn.query(
            "INSERTR INTO tasks (titulo, descripcion, responsable, fecha) VALUES (?, ?, ?, ?)", [titulo, descripcion, responsable, fecha]
        );
        await conn.end();

        res.status(201).json({ id: result.insertId, titulo, descripcion, responsable, fecha });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar tarea
router.put("/:id", async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { titulo, descripcion, responsable, fecha } = req.body;

    if (!titulo || !descripcion || !responsable || !fecha) {
        return res.status(400).json({ error: "Faltan campos obligatorios"});
    }

    try{
        const conn = await getConnection();
        const [result] = await conn.query(
            "UPDATE tasks SET titulo = ?, descripcion = ?, responsable = ?, fecha = ? WHERE id = ?", [titulo, descripcion, responsable, fecha, taskId]
        );

        if (result.affectedRows > 0) {
            res.json({ id: req.params.id, titulo, descripcion, responsable, fecha });
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
        return res.status(400).json({ error: "ID inválido"});
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