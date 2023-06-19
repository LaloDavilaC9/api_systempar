const mysql = require("mysql2");
module.exports = mysql.createConnection({
    host: process.env.DB_SERVER_IP,
    port: process.env.DB_SERVER_PORT,
  user: "MySQL_Client",
  password: "MySQL_Client_Cluster",
  database: "bd_tutorias",
});
