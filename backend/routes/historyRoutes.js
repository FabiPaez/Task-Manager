const express = require('express');
const router = express.Router();
const { getHistoryByTaskId, createHistory } = require('../controllers/historyController');

// Ruta para obtener el historial de estados de una tarea específica por su ID
router.get('/tareas/:id/historial', getHistoryByTaskId);
router.post('/tareas/:id/historial', createHistory);

module.exports = router;
