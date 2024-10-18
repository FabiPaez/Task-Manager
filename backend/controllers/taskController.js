const sql = require('mssql');
const { getConnection } = require('../config/db');

const getTasks = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Tareas');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const getTaskById = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Tareas WHERE Id = @id');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const createTask = async (req, res) => {
    try {
        const { Titulo, Descripcion, FechaCreacion, FechaVencimiento, EstadoId } = req.body;
        const pool = await getConnection();
        await pool.request()
            .input('Titulo', sql.VarChar, Titulo)
            .input('Descripcion', sql.VarChar, Descripcion)
            .input('FechaCreacion', sql.DateTime, FechaCreacion)
            .input('FechaVencimiento', sql.DateTime, FechaVencimiento)
            .input('EstadoId', sql.Int, EstadoId)
            .query('INSERT INTO Tareas (Titulo, Descripcion, FechaCreacion, FechaVencimiento, EstadoId) VALUES (@Titulo, @Descripcion, @FechaCreacion, @FechaVencimiento, @EstadoId)');

        res.status(201).send({ message: 'Tarea creada exitosamente' });
    } catch (err) {
        res.status(500).send({ message: `Error al guardar la tarea: ${err.message}` });
    }
};

const updateTask = async (req, res) => {
    try {
        const { Titulo, Descripcion, FechaVencimiento, EstadoId } = req.body;
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .input('Titulo', sql.VarChar, Titulo)
            .input('Descripcion', sql.VarChar, Descripcion)
            .input('FechaVencimiento', sql.DateTime, FechaVencimiento)
            .input('EstadoId', sql.Int, EstadoId)
            .query('UPDATE Tareas SET Titulo = @Titulo, Descripcion = @Descripcion, FechaVencimiento = @FechaVencimiento, EstadoId = @EstadoId WHERE Id = @id');
        res.send({ message: 'Tarea actualizada exitosamente' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const pool = await getConnection();
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM Tareas WHERE Id = @id');
        res.send({ message: 'Tarea eliminada exitosamente' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
