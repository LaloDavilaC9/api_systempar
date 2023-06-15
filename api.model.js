module.exports = {
    
    login: (connection, id_Alumno,callback) => {
      //console.log("ALUMNO "+id_Alumno);
      let query = "SELECT * FROM Alumno WHERE alumno_id = "+id_Alumno;
      //let query = "select id from administradores where usuario ='lalodavilac9'";
      connection.query(query, (err, results) => {
        if (err) {
          callback({
            array: null,
            id: null,
            success: false,
            err: JSON.stringify(err),
          });
          return;
        }
        //console.log("Results son: "+results);
        callback({ array: results, id: null, success: true });
      });
    },

    enProcesoAlumno: (connection, id_Alumno,callback) => {
      let query = "SELECT m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, a.alumno_telefono, a.alumno_correo, s.solicitud_descripcion, s.solicitud_tema, "+
      "s.solicitud_modalidad, s.solicitud_lugar, s.solicitud_urgencia FROM solicitud AS s INNER JOIN materia AS m ON s.materia_id = m.materia_id "+
      "LEFT JOIN tutor AS t ON s.tutor_id = t.tutor_id LEFT JOIN alumno AS a ON t.alumno_id = a.alumno_id WHERE s.solicitud_fecha_programacion IS NULL AND EXISTS "+
      "(SELECT 1 FROM alumno_solicitud AS al WHERE al.solicitud_id = s.solicitud_id AND al.alumno_id = "+id_Alumno+");";
      connection.query(query, (err, results) => {
        if (err) {
          callback({
            array: null,
            id: null,
            success: false,
            err: JSON.stringify(err),
          });
          return;
        }
        callback({ array: results, id: null, success: true });
      });
    },

    proximasAlumno: (connection, id_Alumno,callback) => {
      let query = "SELECT m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, a.alumno_telefono, a.alumno_correo, s.solicitud_descripcion, s.solicitud_tema, "+
      "s.solicitud_modalidad, s.solicitud_lugar, s.solicitud_urgencia, s.solicitud_fecha_programacion FROM solicitud AS s INNER JOIN materia AS m ON s.materia_id = m.materia_id "+
      "LEFT JOIN tutor AS t ON s.tutor_id = t.tutor_id LEFT JOIN alumno AS a ON t.alumno_id = a.alumno_id WHERE s.solicitud_fecha_programacion IS NOT NULL AND EXISTS "+
      "(SELECT 1 FROM alumno_solicitud AS al WHERE al.solicitud_id = s.solicitud_id AND al.alumno_id = "+id_Alumno+");";
      connection.query(query, (err, results) => {
        if (err) {
          callback({
            array: null,
            id: null,
            success: false,
            err: JSON.stringify(err),
          });
          return;
        }
        callback({ array: results, id: null, success: true });
      });
    },
  
    consultarMateriasParaSolicitud: (connection, idPlan, semestre, callback) => {
      //console.log("Body trae: "+body);
      let query = "SELECT * FROM Materia WHERE materia_id IN (SELECT materia_id FROM Materia_Plan WHERE plan_id = "+idPlan+" AND semestre = "+semestre+");";
      connection.query(query, (err, results) => {
        if (err) {
          callback({
            array: null,
            id: null,
            success: false,
            err: JSON.stringify(err),
          });
          return;
        }
        //console.log("Results son: "+results);
        callback({ array: results, id: null, success: true });
      });
    },

    crearSolicitud: (connection, body, alumno_id, callback) => {
      console.log("Llega: "+body.solicitud_fecha);
      let bodyFiltrado = body
      delete bodyFiltrado.alumno_id
      connection.query("insert into solicitud SET ?", bodyFiltrado, (err, results) => {
        if (err) {
          callback({
            array: null,
            id: null,
            success: false,
            err: JSON.stringify(err),
          });
          return;
        }
        callback({ array: null, id: null, success: true });
      });
    },

    ultimaSolicitud: (connection, alumno_id, callback) => {
      let query = "SELECT * FROM SOLICITUD ORDER BY solicitud_id DESC LIMIT 1";
      id = connection.query(query, (err, results) => {
        if (err) {
          callback({
            array: null,
            id: null,
            success: false,
            err: JSON.stringify(err),
          });
          return;
        }
        //console.log("Results son: "+results);
        callback({ array: results, id: null, success: true });
      });
    },

    insertarAlumnoSolicitud: (connection, alumno_id,solicitud_id, callback) => {
      //console.log("Llega: "+body.solicitud_fecha);
      let query = "insert into alumno_solicitud (alumno_id,solicitud_id,alumno_encargado,alumno_asistencia) VALUES ("+alumno_id+","+solicitud_id+",0,0)";
      connection.query(query, (err, results) => {
        if (err) {
          callback({
            array: null,
            id: null,
            success: false,
            err: JSON.stringify(err),
          });
          return;
        }
        callback({ array: null, id: null, success: true });
      });
    },

  };
  
