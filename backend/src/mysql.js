var mysql = require('koa-mysql');
 
// Create a MySQL connection pool (do this once)
const db = mysql.createPool({ user: 'root', password: '', database: 'test', host: 'localhost' });

module.exports = db;
 