var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    database: 'nodejsproject',
    user: 'root',
    password: 'Omarlm10a$',
    port: 3306
});

module.exports = con;