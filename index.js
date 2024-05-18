const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3001;

const Pool = require('pg').Pool
var fs = require('fs');

app.use(cors());

const pool = new Pool({
    user: 'axely',
    host: 'u3g2j2i2snbbpnwk45gcbmk4hhhepa-primary.postgresql.us-sanjose-1.oc1.oraclecloud.com',
    database: 'cnube',
    password: 'BaseDeDatos123.',
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
    pool.query('INSERT INTO empleado (manager, departamento, puesto, nombre,paterno,materno, sueldo, tipoempleado) VALUES ($1, $2,$3, $4,$5, $6,$7, $8)', [manager, departamento, puesto,nombre,paterno,materno,sueldo,tipo], (error, results) => {
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
    pool.query('update empleado set manager=$1,departamento=$2,puesto=$3,nombre=$4,paterno=$5,materno=$6,sueldo=$7,tipoempleado=$8 where id_empleado=$9', [manager, departamento, puesto,nombre,paterno,materno,sueldo,tipo,id], (error, results) => {
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

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
  });


