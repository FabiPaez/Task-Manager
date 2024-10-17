const sql = require('mssql');
const { getConnection } = require('../config/db');

// Función para obtener el historial de una tarea específica
const getHistoryByTaskId = async (req, res) => {
    const { id } = req.params;  // Obtener el id de la tarea desde los parámetros de la ruta

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('TareaId', sql.Int, id)  // Pasar el id de la tarea como parámetro
            .query(`
                SELECT h.Id, h.TareaId, h.EstadoId, h.Comentario, e.Nombre AS EstadoNombre, h.FechaCambio
                FROM HistorialEstados h
                INNER JOIN Estados e ON h.EstadoId = e.Id
                WHERE h.TareaId = @TareaId  -- Filtrar por el id de la tarea
                ORDER BY h.FechaCambio DESC
            `);
        if (result.recordset.length === 0) {
            return res.status(404).send({ message: 'No se encontró historial para la tarea indicada' });
        }
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = { getHistoryByTaskId };
