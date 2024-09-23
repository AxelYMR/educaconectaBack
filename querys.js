const express = require("express");
const app = express();
const cors = require("cors");
const port = 3001;

const Pool = require('pg').Pool
var fs = require('fs');

app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'educaconecta',
    password: 'root',
    port: 5432
});

app.use(express.json());

app.post("/createU", (request, response) => {
    const correo= request.body.correo;
    const nombre = request.body.nombre;
    const apellido = request.body.apellido;
    const contrasenia = request.body.contrasenia;
    pool.query('INSERT INTO alumnos (correo,nombre,apellido, contrasenia) VALUES ($1, $2,$3, $4)', [correo,nombre,apellido,contrasenia], (error, results) => {
        if (error) {
            throw error
        }else{
            response.send(results);
        }
    })
});

app.get("/selectU", (request, response) => {
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

app.get("/selectD", (request, response) => {
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

app.listen(port, () => {
    console.log(`APP running on port ${port}.`)
});
