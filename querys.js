const express = require("express");
const app = express();
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


app.listen(port, () => { //puerto en el que se esta corriendo el servidor.
    console.log(`APP running on port ${port}.`) //mensaje de que el servidor esta corriendo
});
