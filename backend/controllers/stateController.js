const getConnection = require('../models/dbConnection');
const sql = require('mssql');

async function initializeEstados() {
    try {
      const pool = await poolPromise;
      await pool.request().query(`
        INSERT INTO Estados (Nombre) VALUES ('Pendiente'), ('En Progreso'), ('Completada');
      `);
      console.log('Estados inicializados correctamente');
    } catch (err) {
      console.log('Error al inicializar los estados: ', err);
    }
  }

const getStates = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Estados');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = { getStates, initializeEstados };
