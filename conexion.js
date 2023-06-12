const mysql = require("mysql2");
module.exports = mysql.createConnection({
    host: "localhost",
    port: 3306,
  user: "MySQL_Client",
  password: "MySQL_Client_Cluster",
  database: "bd_tutorias",
});
