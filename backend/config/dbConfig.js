// const config = {   
//     user: 'task', 
//     password: 'Manager-123', // Cambia a la contraseña correcta
//     server: 'localhost', 
//     database: 'TaskManagerDB',
//     options: {
//         port: 1434,
//         trustServerCertificate: true
//     }
// };
const sql = require('mssql');

const config = {
  user: process.env.MSSQL_USERNAME,
  password: process.env.MSSQL_SA_PASSWORD,
  server: process.env.MSSQL_SERVER, // Use the Railway host
  database: 'YourDatabaseName', // Cambia esto al nombre de tu base de datos
  port: parseInt(process.env.MSSQL_TCP_PORT, 10),
  options: {
    encrypt: true, // Usualmente es necesario en la nube
    trustServerCertificate: true, // Para evitar errores SSL
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => console.log('Database connection failed: ', err));

module.exports = {
  sql,
  poolPromise
};
