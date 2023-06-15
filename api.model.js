module.exports = {
    
    login: (connection, id_Alumno,callback) => {
      //console.log("ALUMNO "+id_Alumno);
      //let query = "select max(id) as id from administradores ";+
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

    crearSolicitud: (connection, body, callback) => {
      console.log("Llega: "+body.solicitud_fecha);
      connection.query("insert into solicitud SET ?", body, (err, results) => {
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
  