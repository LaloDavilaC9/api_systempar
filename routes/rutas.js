const express = require("express");
const user = require("../api.model");
const connection = require("../conexion");
const { body, param, validationResult } = require("express-validator");
var router = express.Router();


router.get("/login/:idAlumno", [], (req, res) => {
  //console.log("Desde antes: "+req.params.usuario);
  const idAlumno = req.params.idAlumno;
  user.login(connection, idAlumno,(data) => {
    res.json(data);
  });
});

router.get("/solicitudes/:planId/:semestre", [], (req, res) => {
  //console.log("Desde antes: "+req.params.usuario);
  const idPlan = req.params.planId;
  const semestre = req.params.semestre;
  user.consultarMateriasParaSolicitud(connection,idPlan,semestre, (data) => {
    res.json(data);
  });
});
  
  

module.exports = router;
