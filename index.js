const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

const Pool = require('pg').Pool
var fs = require('fs');

app.use(cors());

const pool = new Pool({
    user: 'axely',
    host: 'localhost',
    database: 'cnube',
    password: 'Akira-21',
    port: 5432,
    ssl: {
    	ca: fs.readFileSync('CaCertificate-db_S.pub') 
    }
});



app.use(express.json());

app.post("/create", (request, response) => {
    const nombre = request.body.nombre;
    const paterno = request.body.paterno;
    const materno = request.body.materno;
    const sueldo = request.body.sueldo;
    const tipo = request.body.tipo;
    const manager = request.body.manager;
    const departamento = request.body.departamento;
    const puesto = request.body.puesto;
    const notas = request.body.notas;
    pool.query('INSERT INTO empleado (manager, departamento, puesto, nombre,paterno,materno, sueldo, tipoempleado,notas) VALUES ($1, $2,$3, $4,$5, $6,$7, $8, $9)', [manager, departamento, puesto,nombre,paterno,materno,sueldo,tipo,notas], (error, results) => {
        if (error) {
            throw error
        }else{
            response.send(results);
        }
    })
});

app.get("/empleados", (request, response) => {
    pool.query('Select * from empleado ORDER BY id_empleado ASC', (error, result) => {
        if (error) {
            throw error
        }else{
            response.status(200).json(result.rows)
        }
    })
});

app.put("/update", (request, response) => {
    const id = request.body.id;
    const nombre = request.body.nombre;
    const paterno = request.body.paterno;
    const materno = request.body.materno;
    const sueldo = request.body.sueldo;
    const tipo = request.body.tipo;
    const manager = request.body.manager;
    const departamento = request.body.departamento;
    const puesto = request.body.puesto;
    const notas = request.body.notas;
    pool.query('update empleado set manager=$1,departamento=$2,puesto=$3,nombre=$4,paterno=$5,materno=$6,sueldo=$7,tipoempleado=$8,notas=$9 where id_empleado=$10', [manager, departamento, puesto,nombre,paterno,materno,sueldo,tipo,notas,id], (error, results) => {
        if (error) {
            throw error
        }else{
            response.send(results);
        }
    })
});

app.delete("/delete/:id", (request, response) => {
    const id = request.params.id;
    pool.query('delete from empleado where id_empleado=$1',[id], (error, results) => {
        if (error) {
            throw error
        }else{
            response.send(results);
        }
    })
});

app.listen(port, () => {
    console.log(`APP running on port ${port}.`)
})


