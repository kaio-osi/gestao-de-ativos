const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',      
    password: '21110400',      // mudar aqui prum .env dps 
    database: 'Estoque',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();