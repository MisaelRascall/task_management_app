const express = require ("express");
const router = express.Router();
const getConnection = require("../config/db");

// Obtener un solo estado
router.get("/:id", async (req, res) => {
    const statusId = parseInt(req.params.id, 10);

    // console.log("ID recibido:", req.params.id, " -> convertido a número:", statusId);

    // Valida si el ID es un número y no una letra
    if (isNaN(statusId)) {
        return res.status(400).json({error: "ID inválido" });
    }

    try {
        const conn = await getConnection();
        const [rows] = await conn.query(`
            SELECT t.estado 
            FROM tasks t 
            WHERE t.id = ?`,
            [statusId]);
        await conn.end();

        if (rows.length >0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: "Tarea no encontrada" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Actualizar status
router.put("/:id", async (req, res) => {
    const statusId = parseInt(req.params.id, 10);
    const { estado } = req.body;

    // console.log("ID recibido: ", statusId, " Estado recibido: ", estado);

    // Valida que el estado este declarado dentro de la propiedad
    if (!["Pendiente", "En proceso", "Terminada"].includes(estado)) {
        return res.status(400).json({ error: "Estado inválido" });
    }

    try {
        const conn = await getConnection();
        const [result] = await conn.query(`
            UPDATE tasks SET estado = ? WHERE id = ?`,
        [estado, statusId]
    );
    await conn.end();

    if (result.affectedRows > 0) {
        res.json({ message: "Estado actualizado correctamente" });
    } else {
        res.status(400).json({ error: "Tarea no encontrada" });
    }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router