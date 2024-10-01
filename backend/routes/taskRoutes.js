const express = require('express');
const { getTasks, getTaskById, createTask, updateTask, deleteTask } = require('../controllers/taskController');

const router = express.Router();

router.get('/tareas', getTasks);
router.get('/tareas/:id', getTaskById);
router.post('/tareas', createTask);
router.put('/tareas/:id', updateTask);
router.delete('/tareas/:id', deleteTask);

module.exports = router;
