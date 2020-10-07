const mysql = require("mysql2");
require("dotenv").config();

const con = mysql.createConnection({
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER ?? "user",
  password: process.env.DB_PASSWORD ?? "pass",
  database: process.env.DB_NAME ?? "db",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

con.query(
  "CREATE TABLE IF NOT EXISTS users ( `id` INTEGER PRIMARY KEY AUTO_INCREMENT, `email` varchar(255) UNIQUE, `password` varchar(255))",
  (err) => {
    if (err) console.log("ERROR: \n", err);
  }
);

module.exports.con = con;
