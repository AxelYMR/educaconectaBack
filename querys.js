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
    const edad = request.body.edad;
    pool.query('INSERT INTO alumno (correo,nombre,apellido, contrasenia, edad) VALUES ($1, $2,$3, $4, $5)', [correo,nombre,apellido,contrasenia, edad], (error, results) => {
        if (error) {
            throw error
        }else{
            response.send(results);
        }
    })
});

app.get("/selectU", (request, response) => {
    const correo= request.body.correo;
    const contrasenia = request.body.contrasenia;
    pool.query('Select correo, contrasenia from alumno WHERE correo = $1 AND contrasenia = $2',[correo, contrasenia], (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows)
        }
    })
});

app.listen(port, () => {
    console.log(`APP running on port ${port}.`)
});
