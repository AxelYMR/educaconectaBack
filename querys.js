const express = require("express");
const app = express();
const multer = require('multer');
const cors = require("cors");
const port = 3001;

const Pool = require('pg').Pool
var fs = require('fs');

app.use(cors());

const pool = new Pool({ //conexion a la base de datos
    user: 'postgres',
    host: 'localhost',
    database: 'educaconecta',
    password: 'root',
    port: 5432
});

app.use(express.json());

app.post("/createU", (request, response) => { //insertar datos en la tabla alumnos
    const correo= request.body.correo;
    const nombre = request.body.nombre;
    const apellido = request.body.apellido;
    const contrasena = request.body.contrasena;
    const especialidad = request.body.especialidad;
    pool.query('INSERT INTO alumnos (correo,nombre,apellidos, contrasena, especialidad) VALUES ($1, $2,$3, $4, $5)', [correo,nombre,apellido,contrasena, especialidad], (error, results) => {
        if (error) {
            throw error
        }else{
            response.send(results);
        }
    })
});

app.post("/createD", (request, response) => { //insertar datos en la tabla docentes
    const correo= request.body.correo;
    const nombre = request.body.nombre;
    const apellido = request.body.apellido;
    const contrasena = request.body.contrasena;
    const especialidad = request.body.especialidad;
    const matricula = request.body.matricula;
    const materia = request.body.materia;
    pool.query('INSERT INTO docentes (matricula,correo,nombre,apellidos, contrasena, especialidad,materia) VALUES ($1, $2, $3, $4, $5, $6, $7)', [matricula,correo,nombre,apellido,contrasena, especialidad, materia], (error, results) => {
        if (error) {
            throw error
        }else{
            response.send(results);
        }
    })
});

app.get("/buscarD", (request, response) => { //seleccionar datos de la tabla docentes
    const correo= request.query.correo;
    const matricula= request.query.matricula;
    pool.query('SELECT correo, matricula FROM docentes WHERE correo = $1 OR matricula = $2',[correo, matricula], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/buscarU", (request, response) => { //seleccionar datos de la tabla docentes
    const correo= request.query.correo;
    pool.query('SELECT correo FROM alumnos WHERE correo = $1',[correo], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.put("/actualizarDocente", (request, response) => {
    const matricula = request.body.matricula; 
    const correo = request.body.correo;
    const contrasena = request.body.contrasena;
    const nombre = request.body.nombre;
    const apellido = request.body.apellido;
    pool.query('UPDATE docentes SET correo = $1, nombre = $2, apellidos = $3, contrasena = $4 WHERE matricula = $5', [correo, nombre, apellido, contrasena, matricula], (error, result) => {
        if (error) {
            response.status(500).send(error);
        } else {
            response.status(200).json(result.rows);
        }
    });
});

app.put("/actualizarAlumno", (request, response) => {
    const matricula = request.body.matricula; 
    const correo = request.body.correo;
    const contrasena = request.body.contrasena;
    const nombre = request.body.nombre;
    const apellido = request.body.apellido;
    pool.query('UPDATE alumnos SET correo = $1, nombre = $2, apellidos = $3, contrasena = $4 WHERE matricula = $5', [correo, nombre, apellido, contrasena, matricula], (error, result) => {
        if (error) {
            response.status(500).send(error);
        } else {
            response.status(200).json(result.rows);
        }
    });
});

app.put("/deleteMateriaD", (request, response) => {
    const matricula = request.body.matricula; 
    console.log(matricula);
    pool.query('UPDATE docentes SET materia = null WHERE matricula = $1', [matricula], (error, result) => {
        if (error) {
            response.status(500).send(error);
        } else {
            response.status(200).json(result.rows);
            console.log(result.rows);
        }
    });
});

app.get("/selectMaterias", (request, response) => {
    const matricula= request.query.matricula;
    pool.query('select nombre, id_materia from materias where id_materia IN (select materias_id_materia from alumnos_has_materias where alumnos_matricula = $1)',[matricula], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows)
        }
    })
});

app.get("/selectMateriasD", (request, response) => {
    const matricula= request.query.matricula;
    pool.query('select materia from docentes where matricula = $1',[matricula], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});


app.get("/selectA", (request, response) => { //seleccionar datos de la tabla alumnos
    const correo= request.query.correo;
    const contrasena = request.query.contrasena;
    pool.query('SELECT * FROM ALUMNOS WHERE contrasena = $1 AND correo = $2',[contrasena, correo], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/contextoA", (request, response) => { //seleccionar datos de la tabla alumnos
    const correo= request.query.correo;
    pool.query('SELECT * FROM ALUMNOS WHERE correo = $1',[correo], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/contextoD", (request, response) => { //seleccionar datos de la tabla alumnos
    const matricula= request.query.matricula;
    pool.query('SELECT * FROM DOCENTES WHERE matricula = $1',[matricula], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/selectD", (request, response) => { //seleccionar datos de la tabla docentes
    const matricula= request.query.matricula;
    const contrasena = request.query.contrasena;
    pool.query('SELECT * FROM DOCENTES WHERE matricula = $1 AND contrasena = $2',[matricula, contrasena], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});


app.delete("/deleteMateria/:id1/:id2", (request, response) => {
    const id1 = request.params.id1;
    const id2 = request.params.id2;
    pool.query('delete from alumnos_has_materias where materias_id_materia = $1 and alumnos_matricula = $2',[id1,id2], (error, results) => {
        if (error) {
            throw error
        }else{
            response.send(results);
        }
    })
});

app.get("/seEncuentraD", (request, response) => { //seleccionar datos de la tabla docentes
    const matricula= request.query.matricula;
    pool.query('SELECT matricula FROM DOCENTES WHERE matricula = $1',[matricula], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/seEncuentraA", (request, response) => { //seleccionar datos de la tabla alumnos
    const correo= request.query.correo;
    pool.query('SELECT correo FROM alumnos WHERE correo = $1',[correo], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/materias", (request, response) => {
    pool.query('SELECT id_materia, nombre FROM materias', (error, results) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        } else {
            return response.status(200).json(results.rows);
        }
    });
});

app.get("/materia/:id", (request, response) => {
    const id = request.params.id;
    pool.query('SELECT * FROM materias WHERE id_materia = $1', [id], (error, results) => {
        if (error) {
            return response.status(500).json({ error: error.message });
        } else {
            return response.status(200).json(results.rows[0]); // Devuelve solo el primer resultado
        }
    });
});

app.get("/buscarMateriasA", (request, response) => { //seleccionar datos de la tabla docentes
    const matricula= request.query.matricula;
    pool.query('SELECT * FROM materias WHERE id_materia in(SELECT materias_id_materia from alumnos_has_materias where alumnos_matricula = $1 )',[matricula], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/buscarMateriasD", (request, response) => { //seleccionar datos de la tabla docentes
    const matricula= request.query.matricula;
    pool.query('SELECT * FROM materias WHERE id_materia in(SELECT materias_id_materia from materias_has_docentes where docentes_matricula = $1 )',[matricula], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/materiasDisponibles", (request, response) => {
    const matricula= request.query.matricula;
    pool.query('select * from materias where id_materia not in (select materias_id_materia from alumnos_has_materias where alumnos_matricula = $1)',[matricula], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/materiasInscritas", (request, response) => {
    const matricula= request.query.matricula;
    pool.query('select * from materias where id_materia in (select materias_id_materia from alumnos_has_materias where alumnos_matricula = $1)',[matricula], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/inscribirCurso", (request, response) => {
    const matricula= request.query.matricula;
    const id_materia= request.query.id_materia;
    pool.query('insert into alumnos_has_materias(alumnos_matricula, materias_id_materia) values ($1, $2)',[matricula,id_materia], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/darDeBaja", (request, response) => {
    const matricula= request.query.matricula;
    const id_materia= request.query.id_materia;
    pool.query('delete from alumnos_has_materias where alumnos_matricula = $1 and materias_id_materia = $2',[matricula,id_materia], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/cantidadDeCursos", (request, response) => {
    const matricula= request.query.matricula;
    pool.query('SELECT COUNT(*) AS count FROM alumnos_has_materias WHERE alumnos_matricula = $1',[matricula], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.get("/cantidadDeAlumnos", (request, response) => {
    const id_materia= request.query.id_materia;
    pool.query('SELECT COUNT(*) AS count FROM alumnos_has_materias WHERE materias_id_materia = $1',[id_materia], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage: storage });

  app.use('/uploads', express.static('uploads'));
  
  // Ruta para manejar la subida de archivos
  app.post('/subirMultimedia', upload.single('file'), (req, res) => {
    const { materiaId, tipo, descripcion } = req.body;
    const filePath = req.file.path.replace(/\\/g, '/');;
    // Aquí puedes guardar la dirección del archivo, el ID de la materia y el tipo en la base de datos
    pool.query('INSERT INTO actividades (materias_id_materias,nombre,tipo, upload) VALUES ($1, $2, $3, $4)', [materiaId, descripcion, tipo, filePath], (error, results) => {
        if (error) {
            console.error('Error al insertar en la base de datos:', error);
            return res.status(500).send('Error al insertar en la base de datos');
        }else{
            console.log('File path:', filePath);
            console.log('Materia ID:', materiaId);
            console.log('Tipo:', tipo);
            console.log('Descripcion:', descripcion);
            res.status(200).json({ filePath: filePath });
        }
    })
  });

app.get("/actividades", (request, response) => {
    const id= request.query.id;
    pool.query('SELECT * from actividades where materias_id_materias =$1 order by id_actividad desc',[id], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
        }
    })
});

app.delete("/eliminarActividad/:id1", (request, response) => {
    const id1 = request.params.id1;
    pool.query('delete from actividades where id_actividad = $1',[id1], (error, results) => {
        if (error) {
            throw error
        }else{
            response.send(results);
        }
    })
});

app.post('/crearExamen', (req, res) => {
    const { materiaId, questions } = req.body;
  
    pool.query('INSERT INTO examenes (id_materia) VALUES ($1) RETURNING id_examen', [materiaId], (error, results) => {
      if (error) {
        console.error('Error al insertar en la base de datos:', error);
        return res.status(500).send('Error al insertar en la base de datos');
      }
  
      const examenId = results.rows[0].id_examen;
  
      const questionPromises = questions.map(q => {
        return pool.query('INSERT INTO preguntas (id_examen, pregunta, respuesta) VALUES ($1, $2, $3)', [examenId, q.question, q.answer]);
      });
  
      Promise.all(questionPromises)
        .then(() => {
          res.status(200).send('Examen creado exitosamente');
        })
        .catch(error => {
          console.error('Error al insertar preguntas en la base de datos:', error);
          res.status(500).send('Error al insertar preguntas en la base de datos');
        });
    });
  });

  app.get("/examenes", (request, response) => {
    const id = request.query.id;
    pool.query(`
        SELECT e.id_examen, p.id_pregunta, p.pregunta, p.respuesta
        FROM examenes e
        JOIN preguntas p ON e.id_examen = p.id_examen
        WHERE e.id_materia = $1
        ORDER BY e.id_examen, p.id_pregunta
    `, [id], (error, result) => {
        if (error) {
            console.error('Error al obtener los exámenes:', error);
            response.status(500).send('Error al obtener los exámenes');
        } else {
            const examenes = {};
            result.rows.forEach(row => {
                if (!examenes[row.id_examen]) {
                    examenes[row.id_examen] = {
                        id_examen: row.id_examen,
                        preguntas: []
                    };
                }
                examenes[row.id_examen].preguntas.push({
                    id_pregunta: row.id_pregunta,
                    pregunta: row.pregunta,
                    respuesta: row.respuesta
                });
            });
            response.status(200).json(Object.values(examenes));
        }
    });
});

app.post('/crearNotificacion', (req, res) => {
    const { id_materia, titulo, mensaje } = req.body;
  
    pool.query('INSERT INTO notificaciones (id_materia, titulo, mensaje) VALUES ($1, $2, $3) RETURNING *', [id_materia, titulo, mensaje], (error, results) => {
      if (error) {
        console.error('Error al insertar en la base de datos:', error);
        return res.status(500).send('Error al insertar en la base de datos');
      }
      res.status(200).json(results.rows[0]);
    });
  });
  
  // Ruta para obtener las notificaciones de una materia
  app.get('/notificaciones', (req, res) => {
    const id_materia = req.query.id_materia;
  
    pool.query('SELECT * FROM notificaciones WHERE id_materia = $1 ORDER BY fecha DESC', [id_materia], (error, results) => {
      if (error) {
        console.error('Error al obtener las notificaciones:', error);
        return res.status(500).send('Error al obtener las notificaciones');
      }
      res.status(200).json(results.rows);
    });
  });

  app.get("/verificarHora", (request, response) => {
    const { matricula, hora } = request.query;
    pool.query(`
        SELECT m.nombre, m.hora
        FROM materias m
        JOIN alumnos_has_materias ahm ON m.id_materia = ahm.materias_id_materia
        WHERE ahm.alumnos_matricula = $1 AND m.hora = $2
    `, [matricula, hora], (error, result) => {
        if (error) {
            console.error('Error al verificar la hora:', error);
            response.status(500).send('Error al verificar la hora');
        } else {
            response.status(200).json(result.rows);
        }
    });
});

app.listen(port, () => { //puerto en el que se esta corriendo el servidor.
    console.log(`APP running on port ${port}.`) //mensaje de que el servidor esta corriendo
});
