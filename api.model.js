module.exports = {
    
    login: (connection, id_Alumno,callback) => {
      //console.log("ALUMNO "+id_Alumno);
      //let query = "SELECT s.solicitud_id, s.solicitud_fecha, s.solicitud_urgencia, m.materia_nombre, s.solicitud_tema, s.solicitud_descripcion, s.solicitud_fecha_programacion, s.solicitud_lugar, s.solicitud_modalidad, s.solicitud_vigente, s.asesoria_evidencia, s.asesoria_calificacion, mt.tutor_id FROM solicitud s JOIN materia_tutor mt ON s.materia_id = mt.materia_id JOIN materia m ON mt.materia_id = m.materia_id WHERE mt.tutor_id = 1 AND EXISTS (SELECT 1 FROM Alumno WHERE alumno_id = "+ id_Alumno+");"
      let query = "SELECT a.*, IFNULL(t.tutor_id, 0) AS tutor_id FROM Alumno a LEFT JOIN tutor t ON a.alumno_id = t.alumno_id WHERE a.alumno_id = "+id_Alumno;
    //"SELECT * FROM Alumno WHERE alumno_id = "+id_Alumno;
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
      let query = "SELECT m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, a.alumno_telefono, a.alumno_correo, s.solicitud_descripcion, s.solicitud_id, s.solicitud_tema, "+
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
      let query = "SELECT m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, a.alumno_telefono, a.alumno_correo, s.solicitud_id, s.solicitud_descripcion, s.solicitud_tema, "+
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

    
    solicitudesTutor: (connection, tutor_id, callback) => {
      let query = "SELECT s.solicitud_id, s.solicitud_fecha, s.solicitud_urgencia, m.materia_nombre, s.solicitud_tema, s.solicitud_descripcion, s.solicitud_fecha_programacion, s.solicitud_lugar, s.solicitud_modalidad, s.solicitud_vigente, s.asesoria_evidencia, s.asesoria_calificacion, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, a.alumno_correo, a.alumno_telefono FROM solicitud s JOIN materia_tutor mt ON s.materia_id = mt.materia_id JOIN materia m ON mt.materia_id = m.materia_id JOIN tutor t ON mt.tutor_id = t.tutor_id JOIN alumno_solicitud als ON s.solicitud_id = als.solicitud_id JOIN alumno a ON als.alumno_id = a.alumno_id WHERE mt.tutor_id = "+tutor_id+" AND s.tutor_id IS NULL;";
     
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

    enProcesoTutor: (connection, tutor_id, callback) => {
      let query = "SELECT s.*, m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, a.alumno_correo, a.alumno_telefono FROM solicitud s JOIN materia m ON s.materia_id = m.materia_id JOIN alumno a ON a.alumno_id = s.tutor_id WHERE s.tutor_id = "+tutor_id+" AND s.solicitud_fecha_programacion IS NULL;";
     
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

    
    proximasTutor: (connection, tutor_id, callback) => {
      let query = "SELECT s.*, m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, a.alumno_correo, a.alumno_telefono FROM solicitud s JOIN materia m ON s.materia_id = m.materia_id JOIN alumno a ON a.alumno_id = s.tutor_id WHERE s.tutor_id = "+tutor_id+" AND s.solicitud_fecha_programacion IS NOT NULL;";
     
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

    aceptarSolicitud: (connection,body, callback) => {
      //console.log("Llega: "+body.solicitud_fecha);
      //let query = "insert into alumno_solicitud (alumno_id,solicitud_id,alumno_encargado,alumno_asistencia) VALUES ("+alumno_id+","+solicitud_id+",0,0)";
      let query = "UPDATE solicitud SET tutor_id = "+body.tutor_id+" WHERE solicitud_id = "+body.solicitud_id;
      console.log(query);
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

     cancelarSolicitud : async (connection, body, callback) => {
      let query = "";
      let query2 = "";
    
      if (body.quien == 'alumno') {
        // El que canceló es el alumno
        query = `DELETE FROM alumno_solicitud WHERE solicitud_id = ${body.solicitud_id}`;
        query2 = `DELETE FROM solicitud WHERE solicitud_id = ${body.solicitud_id}`;
        console.log(query);
        console.log(query2);
      } else {
        query = `UPDATE solicitud SET tutor_id = NULL, solicitud_fecha_programacion = NULL, solicitud_lugar = NULL WHERE solicitud_id = ${body.solicitud_id}`;
      }
    
      try {
        await connection.promise().query(query);
        if (query2) {
          await connection.promise().query(query2);
        }
        callback({ array: null, id: null, success: true });
      } catch (error) {
        callback({
          array: null,
          id: null,
          success: false,
          err: JSON.stringify(error),
        });
      }
    },  
    
    programarSolicitud: (connection,body, callback) => {
      //console.log("Llega: "+body.solicitud_fecha);
      //let query = "insert into alumno_solicitud (alumno_id,solicitud_id,alumno_encargado,alumno_asistencia) VALUES ("+alumno_id+","+solicitud_id+",0,0)";
      let query = "UPDATE solicitud SET solicitud_fecha_programacion = '"+body.fecha_programacion+"', solicitud_lugar = '"+body.lugar+"' WHERE solicitud_id = "+body.solicitud_id;
      console.log(query);
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
  
