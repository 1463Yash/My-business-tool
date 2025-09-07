const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Abc@1463", 
  database: "mybusiness",
});

// Connect
db.connect((err) => {
  if (err) return console.error("❌ MySQL connection error:", err.message);
  console.log("✅ MySQL connected.");
});

module.exports = db;
