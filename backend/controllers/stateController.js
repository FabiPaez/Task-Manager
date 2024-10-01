const getConnection = require('../models/dbConnection');
const sql = require('mssql');

const getStates = async (req, res) => {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT * FROM Estados');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = { getStates };
