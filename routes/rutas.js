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

router.get("/enProcesoAlumno/:idAlumno", [], (req, res) => {
  //console.log("Desde antes: "+req.params.usuario);
  const idAlumno = req.params.idAlumno;
  user.enProcesoAlumno(connection, idAlumno,(data) => {
    res.json(data);
  });
});

router.get("/proximasAlumno/:idAlumno", [], (req, res) => {
  //console.log("Desde antes: "+req.params.usuario);
  const idAlumno = req.params.idAlumno;
  user.proximasAlumno(connection, idAlumno,(data) => {
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

router.get("/solicitudesTutor/:idTutor", [], (req, res) => {
  //console.log("Desde antes: "+req.params.usuario);
  const idTutor = req.params.idTutor;
  user.solicitudesTutor(connection, idTutor,(data) => {
    res.json(data);
  });
});

router.get("/enProcesoTutor/:idTutor", [], (req, res) => {
  //console.log("Desde antes: "+req.params.usuario);
  const idTutor = req.params.idTutor;
  user.enProcesoTutor(connection, idTutor,(data) => {
    res.json(data);
  });
});

router.get("/proximasTutor/:idTutor", [], (req, res) => {
  //console.log("Desde antes: "+req.params.usuario);
  const idTutor = req.params.idTutor;
  user.proximasTutor(connection, idTutor,(data) => {
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
    //console.log("Llega ");
    //console.log(body.alumno_id);
    let alumno_id = body.alumno_id
    user.crearSolicitud(connection, body, alumno_id, (data) => {
      user.ultimaSolicitud(connection,alumno_id,(ultimaSolicitudData) =>{
        user.insertarAlumnoSolicitud(connection,alumno_id,ultimaSolicitudData.array[0].solicitud_id,(insertAlumnoData) =>{
          res.json(insertAlumnoData);
        });
      });
    });
  }
);

router.post(
  "/aceptarSolicitud",
  (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ success: false, err: JSON.stringify(errors) });
      return;
    }
    let body = req.body;

    user.aceptarSolicitud(connection, body, (data) => {
      res.json(data);

    });
  }
);

router.post(
  "/cancelarSolicitud",
  (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ success: false, err: JSON.stringify(errors) });
      return;
    }
    let body = req.body;
    
    
    user.cancelarSolicitud(connection, body, (data) => {
      res.json(data);

    });
  }
);

router.post(
  "/programarSolicitud",
  (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({ success: false, err: JSON.stringify(errors) });
      return;
    }
    let body = req.body;
    
    
    user.programarSolicitud(connection, body, (data) => {
      res.json(data);

    });
  }
);



  /*const responseData = {
          alumno_id: body.alumno_id,
          ultimaSolicitud: ultimaSolicitudData
        };*/
  

module.exports = router;
