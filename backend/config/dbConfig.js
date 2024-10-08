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
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: true, // Railway uses encrypted connections
        trustServerCertificate: false // Cambia a true si es necesario
    }
};

module.exports = config;
