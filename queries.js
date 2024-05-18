const Pool = require('pg').Pool
var fs = require('fs');

const pool = new Pool({
    user: 'axely',
    host: 'mdj3irdro6lm62brvfamcv2smcypyq-primary.postgresql.us-sanjose-1.oc1.oraclecloud.com',
    database: 'cnube',
    password: 'BaseDeDatos123.',
    port: 5432,
    ssl: {
    	ca: fs.readFileSync('CaCertificate-db_S.pub') 
    }
})


// GET 
const getEmpleado = (request, response) => {
    pool.query('SELECT * FROM empleado ORDER BY id_empleado ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const createEmpleado = (request, response) => {
    const nombre = req.body.nombre;
    const paterno = req.body.paterno;
    const materno = req.body.materno;
    const contratacion = req.body.contratacion;
    const sueldo = req.body.sueldo;
    const tipo = req.body.tipo;
    const manager = req.body.manager;
    const departamento = req.body.departamento;
    const puesto = req.body.puesto;
    pool.query('INSERT INTO empleado (manager, departamento, puesto, nombre,paterno,materno,fecha_contratacion, sueldo, tipoempleado) VALUES ($1, $2,$3, $4,$5, $6,$7, $8,$9)', [manager, departamento, puesto,nombre,paterno,materno,contratacion,sueldo,tipo], (error, results) => {
        if (error) {
            throw error
        }else{
            response.send('Empleado Agregados');
        }
        
    })
}

module.exports = {
    getEmpleado,
    createEmpleado
}