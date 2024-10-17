const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sql = require('mssql');

// Rutas
const taskRoutes = require('./routes/taskRoutes');
const stateRoutes = require('./routes/stateRoutes');
const historyRoutes = require('./routes/historyRoutes');

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(bodyParser.json());

// Configuración de la base de datos
const config = {
    user: 'task',
    password: 'Manager-123',
    server: 'localhost',
    database: 'TaskManagerDB',
    options: {
        trustServerCertificate: true,
        port: 1433
    }   
};

// Establecer conexión a la base de datos antes de inicializar las rutas
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conexión exitosa a SQL Server');

        // Inicializar rutas después de la conexión a la base de datos
        app.use('/api', taskRoutes);
        app.use('/api', stateRoutes);
        app.use('/api', historyRoutes); 
    })
    .catch(err => {
        console.error('Error en la conexión a la base de datos: ', err);
        process.exit(1); // Termina el proceso si falla la conexión
    });

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// Exportar conexión para ser utilizada en otros archivos si es necesario
module.exports = { sql };

