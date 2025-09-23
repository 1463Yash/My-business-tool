// dbPool.js (new pool, for transactions)
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Abc@1463",
  database: "mybusiness",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


  
module.exports = pool;
