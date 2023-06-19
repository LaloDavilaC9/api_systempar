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
      let query = `SELECT m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, a.alumno_telefono, a.alumno_correo, s.solicitud_descripcion, s.solicitud_id, s.solicitud_tema, 
      s.solicitud_modalidad, s.solicitud_lugar, s.solicitud_urgencia, s.solicitud_fecha FROM solicitud AS s INNER JOIN materia AS m ON s.materia_id = m.materia_id 
      LEFT JOIN tutor AS t ON s.tutor_id = t.tutor_id LEFT JOIN alumno AS a ON t.alumno_id = a.alumno_id WHERE s.solicitud_fecha_programacion IS NULL AND 
      s.solicitud_vigente = 1
      AND EXISTS 
      (SELECT 1 FROM alumno_solicitud AS al WHERE al.solicitud_id = s.solicitud_id AND al.alumno_id = ${id_Alumno})
      
      ;`;
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
        callback({ array: results, id: null, success: true });
      });
    },

    proximasAlumno: (connection, id_Alumno,callback) => {
      let query = `
      SELECT m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, 
      a.alumno_telefono, a.alumno_correo, s.solicitud_id, s.solicitud_descripcion, s.solicitud_tema, 
      s.solicitud_modalidad, s.solicitud_lugar, s.solicitud_urgencia, s.solicitud_fecha_programacion,
      s.solicitud_fecha FROM solicitud AS s 
      
      INNER JOIN materia AS m ON s.materia_id = m.materia_id 
      INNER JOIN tutor AS t ON s.tutor_id = t.tutor_id 
      INNER JOIN alumno AS a ON t.alumno_id = a.alumno_id
       WHERE s.solicitud_fecha_programacion IS NOT NULL AND EXISTS
      (SELECT 1 FROM alumno_solicitud AS al WHERE al.solicitud_id = s.solicitud_id 
      AND al.alumno_id = ${id_Alumno} AND al.alumno_encargado = 1) AND s.solicitud_vigente = 1
      ;`;

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
        callback({ array: results, id: null, success: true });
      });
    },
  
    consultarMateriasParaSolicitud: (connection, idPlan, semestre, callback) => {
      //console.log("Body trae: "+body);
      let query = "SELECT * FROM Materia WHERE materia_id IN (SELECT materia_id FROM Materia_Plan WHERE plan_id = "+idPlan+" AND semestre = "+semestre+");";
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
        console.log("Results son: "+results);
        callback({ array: results, id: null, success: true });
      });
    },

    crearSolicitud: (connection, body, alumno_id, callback) => {
      //console.log("Llega: "+body.solicitud_fecha);
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
      let query = "insert into alumno_solicitud (alumno_id,solicitud_id,alumno_encargado,alumno_asistencia) VALUES ("+alumno_id+","+solicitud_id+",1,0)";
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
   

        let query = `
        SELECT s.solicitud_id, s.solicitud_fecha, s.solicitud_urgencia, m.materia_nombre,
        s.solicitud_tema, s.solicitud_descripcion, s.solicitud_fecha_programacion,
        s.solicitud_lugar, s.solicitud_modalidad, s.solicitud_vigente, s.asesoria_evidencia,
        s.asesoria_calificacion, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo,
        a.alumno_correo, a.alumno_telefono
        FROM solicitud s
        JOIN materia_tutor mt ON s.materia_id = mt.materia_id
        JOIN materia m ON mt.materia_id = m.materia_id
        JOIN tutor t ON mt.tutor_id = t.tutor_id
        JOIN alumno_solicitud als ON s.solicitud_id = als.solicitud_id
        JOIN alumno a ON als.alumno_id = a.alumno_id
        WHERE mt.tutor_id = ${tutor_id}
          AND s.tutor_id IS NULL
          AND (s.solicitud_rechazados IS NULL OR NOT FIND_IN_SET(mt.tutor_id, s.solicitud_rechazados));
 

        `;
        console.log(query);
     
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
      let query = `
      SELECT s.*, m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, 
      a.alumno_correo, a.alumno_telefono FROM solicitud s 
      INNER JOIN materia m ON s.materia_id = m.materia_id
      INNER JOIN alumno_solicitud asol ON asol.solicitud_id = s.solicitud_id 
      INNER JOIN alumno a ON a.alumno_id = asol.alumno_id
      WHERE s.tutor_id = ${tutor_id}
      AND s.solicitud_fecha_programacion IS NULL
      AND s.solicitud_vigente = 1
      ;
      `;
     console.log(query);
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
      let query = `
      SELECT s.*, m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, 
      a.alumno_correo, a.alumno_telefono FROM solicitud s 
      
      INNER JOIN materia m ON s.materia_id = m.materia_id
      
      INNER JOIN alumno_solicitud asol ON asol.solicitud_id = s.solicitud_id 
      INNER JOIN alumno a ON a.alumno_id = asol.alumno_id
      
      WHERE s.tutor_id = ${tutor_id}
      AND s.solicitud_fecha_programacion IS NOT NULL
      AND s.solicitud_vigente = 1
      AND asol.alumno_encargado = 1;
      ;`;
     //      AND asol.alumno_encargado = 1;
     console.log("hola");
      console.log(query);
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
        // El que canceló fue el alumno
        query = `DELETE FROM alumno_solicitud WHERE solicitud_id = ${body.solicitud_id}`;
        query2 = `DELETE FROM solicitud WHERE solicitud_id = ${body.solicitud_id}`;
        console.log("Canceló el alumno");
        console.log(query);
        console.log(query2);
      } else {
        //El que canceló fue el tutor
        console.log("Canceló el tutor");
        query = `UPDATE solicitud SET tutor_id = NULL, solicitud_fecha_programacion = NULL, solicitud_lugar = NULL, 
        solicitud_rechazados = CONCAT_WS(',', IFNULL(solicitud_rechazados, ''), '${body.tutor_id}')
        WHERE solicitud_id = ${body.solicitud_id}`;
        console.log(query);
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


    //PETICIONES DE CYNTHIA
    alumnosInvitados: (connection,body, callback) => {
      //console.log("Llega: "+body.solicitud_fecha);
      //let query = "insert into alumno_solicitud (alumno_id,solicitud_id,alumno_encargado,alumno_asistencia) VALUES ("+alumno_id+","+solicitud_id+",0,0)";
      let alumnosIds = body.alumnosIds;
      console.log(body);
      let query = `INSERT INTO alumno_solicitud (alumno_id, solicitud_id, alumno_encargado, alumno_asistencia) VALUES ?;`;
      const values = alumnosIds.map(alumnoId => [alumnoId, body.solicitud_id, 0, 0]);
      console.log(query);


      connection.query(query, [values], (err, results) => {
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

    informacionGeneral: (connection, idAlumno, callback) => {
      let query = `
      SELECT p.*, carr.*, cent.* FROM Alumno AS al INNER JOIN plan_estudio AS p ON al.plan_id = p.plan_id INNER JOIN carrera AS 
      carr ON carr.carrera_id = p.carrera_id 
      INNER JOIN centro AS cent ON carr.centro_id = cent.centro_id WHERE al.alumno_id = ${idAlumno};
      `;
     
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

    informacionTutor: (connection, idTutor, callback) => {
      let query = `
      SELECT t.tutor_id, t.alumno_id, t.tutor_promedio,
      t.tutor_fecha_inscripcion, t.tutor_fecha_finalizacion,
      t.tutor_programa, t.tutor_programa_numero,
      (
          SELECT AVG(COALESCE(s.asesoria_calificacion, 0))
          FROM solicitud s
          WHERE s.tutor_id = t.tutor_id AND s.solicitud_vigente = 0
      ) AS tutor_calificacion,
      t.tutor_vigente
      FROM tutor t
      WHERE t.tutor_id = ${idTutor};

      `;
     
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

    materiasMenoresTutor: (connection, idAlumno, callback) => {

      let query = `
      SELECT m.materia_id, m.materia_nombre
      FROM materia m
      JOIN materia_plan mp ON m.materia_id = mp.materia_id
      JOIN alumno a ON mp.semestre < a.alumno_semestre
      WHERE a.alumno_id = ${idAlumno} AND a.plan_id = mp.plan_id;      
      `;
     
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

    materiasTutor: (connection, idTutor, callback) => {

      let query = `
      SELECT m.materia_nombre, m.materia_id FROM  materia m 
      INNER JOIN Materia_Tutor mt ON m.materia_id = mt.materia_id WHERE mt.tutor_id = ${idTutor};      
      `;
     
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

    registrarTutor: (connection,body, callback) => {
      //console.log("Llega: "+body.solicitud_fecha);
      //let query = "insert into alumno_solicitud (alumno_id,solicitud_id,alumno_encargado,alumno_asistencia) VALUES ("+alumno_id+","+solicitud_id+",0,0)";
      let materias = body.materias

      const tutorData = {
        alumno_id: body.alumno_id,
        tutor_promedio: body.promedio,
        tutor_fecha_inscripcion: body.fecha_inscripcion,
        tutor_programa: body.programa,
        tutor_programa_numero: 1,
        tutor_calificacion: 0,
        tutor_vigente: 1,
      };


      connection.query("INSERT INTO tutor SET ?", tutorData, (err, results) => {
        const tutorId = results.insertId;

        // Insertar las materias asociadas al tutor en la tabla `materia_tutor`
        const materiaTutorData = materias.map((materia) => [
          tutorId,
          materia.materia_id,
          materia.promedio_materia,
        ]);

        console.log(materiaTutorData)
        connection.query(
          'INSERT INTO materia_tutor (tutor_id, materia_id, promedio_materia) VALUES ?',
          [materiaTutorData],
          (err, result) => {
            if (err) {
              console.error('Error al insertar las materias del tutor: ', err);
            } else {
              console.log('Materias del tutor insertadas correctamente.');
              callback({ array: null, id: null, success: true });
            }
          }
        );
      });
    },

    finalizadasAlumno: (connection, idAlumno, callback) => {

   

      let query2 = "SELECT m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, a.alumno_telefono, a.alumno_correo, s.solicitud_id, s.solicitud_descripcion, s.solicitud_tema, "+
      "s.solicitud_modalidad, s.solicitud_lugar, s.solicitud_urgencia, s.solicitud_fecha_programacion, s.solicitud_fecha FROM solicitud AS s INNER JOIN materia AS m ON s.materia_id = m.materia_id "+
      "LEFT JOIN tutor AS t ON s.tutor_id = t.tutor_id LEFT JOIN alumno AS a ON t.alumno_id = a.alumno_id WHERE s.solicitud_vigente = 0 AND EXISTS "+
      "(SELECT 1 FROM alumno_solicitud AS al WHERE al.solicitud_id = s.solicitud_id AND al.alumno_id = "+idAlumno+");";
      
      let query = `
      SELECT m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, 
      a.alumno_telefono, a.alumno_correo, s.solicitud_id, s.solicitud_descripcion, s.solicitud_tema, 
      s.solicitud_modalidad, s.solicitud_lugar, s.solicitud_urgencia, s.solicitud_fecha_programacion,
      s.solicitud_fecha FROM solicitud AS s 
      
      INNER JOIN materia AS m ON s.materia_id = m.materia_id 
      INNER JOIN tutor AS t ON s.tutor_id = t.tutor_id 
      INNER JOIN alumno AS a ON t.alumno_id = a.alumno_id
       WHERE s.solicitud_fecha_programacion IS NOT NULL AND EXISTS
      (SELECT 1 FROM alumno_solicitud AS al WHERE al.solicitud_id = s.solicitud_id 
      AND al.alumno_id = ${id_Alumno} AND al.alumno_encargado = 1) AND s.solicitud_vigente = 0
      ;`;

     console.log(query1);
      id = connection.query(query1, (err, results) => {
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

    finalizadasTutor: (connection, idTutor, callback) => {

      /*let query = `
        SELECT *  FROM solicitud s
        INNER JOIN alumno_solicitud asol ON asol.solicitud_id = s.solicitud_id
        INNER JOIN alumno a ON a.alumno_id = asol.alumno_id 
        WHERE s.solicitud_vigente=0 AND s.tutor_id = ${idTutor} AND asol.alumno_encargado = 1
        ORDER BY solicitud_fecha_programacion DESC;
      `;*/

      let query2 = `
      SELECT s.*, m.materia_nombre, CONCAT(a.alumno_nombre, ' ', a.alumno_apellidos) AS tutor_nombre_completo, 
      a.alumno_correo, a.alumno_telefono FROM solicitud s 
      
      INNER JOIN materia m ON s.materia_id = m.materia_id
      
      INNER JOIN alumno_solicitud asol ON asol.solicitud_id = s.solicitud_id 
      INNER JOIN alumno a ON a.alumno_id = asol.alumno_id
      
      WHERE s.tutor_id = ${idTutor}
      AND s.solicitud_vigente = 0 AND asol.alumno_encargado = 1;`;


     console.log(query2);
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
    finalizarAsesoria: (connection,body, callback) => {
      //console.log("Llega: "+body.solicitud_fecha);
      //let query = "insert into alumno_solicitud (alumno_id,solicitud_id,alumno_encargado,alumno_asistencia) VALUES ("+alumno_id+","+solicitud_id+",0,0)";
     
      let query = `UPDATE solicitud SET solicitud_vigente = 0,  asesoria_evidencia = '${body.evidencia}' WHERE solicitud_id = ${body.solicitud_id}`;
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
  
