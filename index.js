const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./conexion");
const cors = require('cors');
const app = express();

app.use(cors())

const misrutas = require("./routes/rutas");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", misrutas);
connection.connect((err, res) => {
  if (err) {
    console.log(err);
    console.log("Error de conexion con sql");
    return;
  }
  console.log("Conexion exitosa a la base de datos");
});
app.listen(3000, (err, res) => {
  if (err) {
    console.log("Error al levantar servidor");
    return;
  }
  console.log("Apis escuchando en el puerto 3000");
});
