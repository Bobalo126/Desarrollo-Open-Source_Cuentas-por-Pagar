const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express(); //Iniciamos express
app.use(cors()); //Hacemos que express use cors para que pueda aceptar cualquier solicitud
app.use(express.json()); //Para que pueda leer datos en .json

const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'admin',          
  database: 'cuentasporpagar'
});

//Para probar la conexión al servidor
db.connect(error => {
  if (error) {
    console.error('Error conectando a MySQL:', error);
  } else {
    console.log('Conectado exitosamente a MySQL');
  }
});

// El Querry para que GestionParametros saque la info de la bdd
app.get('/parametros', (req, res) => {
  const sql = 'SELECT * FROM parametros';
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error en la base de datos' });
    } else {
      res.json(results); // Enviamos los datos al frontend
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});