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
  

router.post(
  "/nuevaSolicitud",
  [
    body("solicitud_fecha").not().isEmpty().isString(),
    body("solicitud_urgencia").not().isEmpty().isString(),
    body("solicitud_tema").not().isEmpty().isString(),
    body("solicitud_descripcion").not().isEmpty().isString(),
    body("solicitud_modalidad").not().isEmpty().isString()
  ],
  (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ success: false, err: JSON.stringify(errors) });
      return;
    }
    let body = req.body;
    //body.telefono = body.telefono.replaceAll(" ","");
    //console.log("lo que llega al body: "+body);
    user.crearSolicitud(connection, body, (data) => {
      res.json(data);
    });
  }
);

  

module.exports = router;
