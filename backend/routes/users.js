const express = require("express");
const router = express.Router();
const getConnection = require("../config/db");

// Obtener todos los usuarios
router.get("/", async (req, res) => {
    try {
        const conn = await getConnection();
        const [rows] = await conn.query("SELECT * FROM users");
        await conn.end();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Obtener un usuario por id
router.get("/:id", async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    
    // console.log("ID recibido:", req.params.id, " -> convertido a número:", userId);

    // Validando si el ID es un número
    if (isNaN(userId)) {
        return res.status(400).json({error: "ID inválido" });
    }

    try {
        const conn = await getConnection();
        const [rows] = await conn.query("SELECT * FROM users WHERE id = ?", [userId]);
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

// Crear un usuario
router.post("/", async (req, res) => {
    res.send(req.body);

    // console.log("Body recibido:", req.body);

    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({error: "El campo 'nombre' es obligatorio" })
    }

    try {
        const conn = await getConnection();
        const [result] = await conn.query(
            "INSERT INTO users (nombre) VALUES (?)",
            [nombre]
        );
        await conn.end();

        res.status(201).json({ id: result.insertId, nombre });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar un usuario
router.put("/:id", async (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const { nombre } = req.body;

    // Validando si el ID es un número
    if (isNaN(userId)) {
        return res.status(400).json({ error: "ID inválido" });
    }

    // Valida si nombre tiene algún contenido
    if (!nombre) {
        return res.status(400).json({error: "El campo 'nombre' es obligatorio" });
    }

    try {
        const conn = await getConnection();
        const [result] = await conn.query(
            "UPDATE users SET nombre = ? WHERE id = ?",
            [nombre, userId]
        );
        await conn.end();

        if (result.affectedRows > 0) {
            res.json({ id: req.params.id, nombre });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar un usuario
router.delete("/:id", async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    // Muestra el contenido de req.data recomendado solo en modo desarrollo
    // console.log("ID recibido:", req.params.id, " -> convertido a número:", userId);
    
    // Validando si el ID es un número
    if (isNaN(userId)) {
        return res.status(400).json({error: "ID inválido" })
    }

    try {
        const conn = await getConnection();
        const [result] = await conn.query("DELETE FROM users WHERE id = ?", [userId]);
        await conn.end();

        if (result.affectedRows > 0) {
            res.json({ mensaje: "Usuario eliminado" });
        } else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
