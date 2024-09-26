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

app.get("/selectU", (request, response) => { //seleccionar datos de la tabla alumnos
    const correo= request.query.correo;
    const contrasena = request.query.contrasena;
    pool.query('SELECT contrasena, correo FROM ALUMNOS WHERE contrasena = $1 AND correo = $2',[contrasena, correo], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
            console.log(result.rows);
        }
    })
});

app.get("/selectD", (request, response) => { //seleccionar datos de la tabla docentes
    const matricula= request.query.matricula;
    const contrasena = request.query.contrasena;
    pool.query('SELECT matricula, contrasena FROM DOCENTES WHERE matricula = $1 AND contrasena = $2',[matricula, contrasena], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows);
            console.log(result.rows);
            console.log(matricula);
            console.log(contrasena);
        }
    })
});

app.listen(port, () => { //puerto en el que se esta corriendo el servidor.
    console.log(`APP running on port ${port}.`) //mensaje de que el servidor esta corriendo
});
