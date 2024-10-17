const sql = require('mssql');

const dbConfig = {
  user: 'task', 
  password: 'Manager-123',  // Cambia a la contraseña real
  server: 'localhost',
  database: 'TaskManagerDB',
  options: {
    trustServerCertificate: true,  // Solo para desarrollo local
    port: 1433,  // Asegúrate de que este puerto sea correcto para tu configuración
    requestTimeout: 30000  // 30 segundos
  }
};

// Función para obtener la conexión a la base de datos
async function getConnection() {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    throw error;
  }
}

module.exports = { getConnection };
