const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuración de la conexión a la base de datos
const config = {   
    user: 'task', 
    password: 'Manager-123', // Cambia a la contraseña que hayas establecido
    server: 'localhost', 
    database: 'TaskManagerDB',
    options: {
        port: 1434,  // Cambia al puerto correcto (ya lo hiciste)
        trustServerCertificate: true // Si estás usando SSL o el entorno lo requiere
    }
};

// Obtener todas las tareas
app.get('/api/tareas', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Tareas');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Endpoint para obtener los estados
app.get('/api/estados', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Estados');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Endpoint para obtener Nombre de un Estado, pasando un IdEstado
app.get('/api/estados/:id', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT Nombre FROM Estados WHERE Id = @id');
        
        if (result.recordset.length === 0) {
            return res.status(404).send({ message: 'Estado no encontrado' });
        }
        
        res.json(result.recordset[0]); // Devuelve el primer registro
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});


// Obtener una tarea por ID
app.get('/api/tareas/:id', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('SELECT * FROM Tareas WHERE Id = @id');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Crear una nueva tarea
app.post('/api/tareas', async (req, res) => {
    try {
        const { Titulo, Descripcion, FechaCreacion, FechaVencimiento, EstadoId } = req.body;
        const pool = await sql.connect(config);
        console.log(req.body);
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
});

// Actualizar una tarea
app.put('/api/tareas/:id', async (req, res) => {
    try {
        const { Titulo, Descripcion, FechaVencimiento, EstadoId } = req.body;
        const pool = await sql.connect(config);
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
});

// Eliminar una tarea
app.delete('/api/tareas/:id', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        
        // Eliminar primero los registros vinculados en HistorialEstados
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM HistorialEstados WHERE TareaId = @id');
        
        // Luego eliminar la tarea
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM Tareas WHERE Id = @id');
        
        res.send({ message: 'Tarea eliminada exitosamente' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});


// Obtener el historial de estados de una tarea
app.get('/api/tareas/:id/historial', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('tareaId', sql.Int, req.params.id)
            .query('SELECT * FROM HistorialEstados WHERE TareaId = @tareaId');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Cambiar el estado de una tarea y registrar en el historial
app.post('/api/tareas/:id/cambiar_estado', async (req, res) => {
    try {
        const { EstadoId, Comentario, FechaCambio } = req.body;
        const pool = await sql.connect(config);       

        // Registrar en el historial
        await pool.request()
            .input('TareaId', sql.Int, req.params.id)
            .input('EstadoId', sql.Int, EstadoId)
            .input('FechaCambio', sql.DateTime, FechaCambio)
            .input('Comentario', sql.VarChar, Comentario)
            .query('INSERT INTO HistorialEstados (TareaId, EstadoId, FechaCambio, Comentario) VALUES (@TareaId, @EstadoId, @FechaCambio, @Comentario)');

        res.send({ message: 'Estado de tarea actualizado y registrado en el historial' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Implement other CRUD operations...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
