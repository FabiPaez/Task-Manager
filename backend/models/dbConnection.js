const sql = require('mssql');
const config = require('../config/dbConfig');

async function getConnection() {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        throw new Error(`Error en la conexión a la base de datos: ${error.message}`);
    }
}

module.exports = getConnection;
