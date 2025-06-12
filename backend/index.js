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

// CRUDS de Gestión de Parámetros.
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

app.post('/parametros', (req, res) => {
  const { anio_proceso, mes_proceso, cierre_ejecutado } = req.body;
  const sql = 'INSERT INTO parametros (anio_proceso, mes_proceso, cierre_ejecutado) VALUES (?, ?, ?)';
  db.query(sql, [anio_proceso, mes_proceso, cierre_ejecutado], (err, result) => {
    if (err) {
      console.error('Error al insertar:', err);
      res.status(500).json({ error: 'Error al insertar el parámetro' });
    } else {
      res.json({ message: 'Parámetro creado correctamente' });
    }
  });
});

app.put('/parametros/:anio/:mes', (req, res) => {
  const { anio, mes } = req.params;
  const { nuevo_anio, nuevo_mes, cierre_ejecutado } = req.body;

  const sql = `UPDATE parametros
    SET anio_proceso = ?, mes_proceso = ?, cierre_ejecutado = ?
    WHERE anio_proceso = ? AND mes_proceso = ?`;

  db.query(sql, [nuevo_anio, nuevo_mes, cierre_ejecutado, anio, mes], (err, result) => {
    if (err) {
      console.error('Error al actualizar el parámetro:', err);
      return res.status(500).json({ error: 'Error al actualizar el parámetro' });
    }
    res.json({ message: 'Parámetro actualizado correctamente' });
  });
});

app.delete('/parametros/:anio/:mes', (req, res) => {
  const { anio, mes } = req.params;

  const sql = 'DELETE FROM parametros WHERE anio_proceso = ? AND mes_proceso = ?';
  db.query(sql, [anio, mes], (err, result) => {
    if (err) {
      console.error('Error al eliminar:', err);
      res.status(500).json({ error: 'Error al eliminar el parámetro' });
    } else {
      res.json({ message: 'Parámetro eliminado correctamente' });
    }
  });
});

// Gestión de Conceptos de Pago
app.get('/conceptos', (req, res) => {
  db.query('SELECT * FROM conceptospago', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener conceptos' });
    res.json(results);
  });
});

app.post('/conceptos', (req, res) => {
  const { descripcion, estado } = req.body;
  const sql = 'INSERT INTO conceptospago (descripcion, estado) VALUES (?, ?)';
  db.query(sql, [descripcion, estado], (err) => {
    if (err) return res.status(500).json({ error: 'Error al crear concepto' });
    res.json({ message: 'Concepto creado correctamente' });
  });
});

app.put('/conceptos/:id', (req, res) => {
  const { id } = req.params;
  const { descripcion, estado } = req.body;
  const sql = 'UPDATE conceptospago SET descripcion = ?, estado = ? WHERE id = ?';
  db.query(sql, [descripcion, estado, id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al editar concepto' });
    res.json({ message: 'Concepto actualizado correctamente' });
  });
});

app.delete('/conceptos/:id', (req, res) => {
  db.query('DELETE FROM conceptospago WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar concepto' });
    res.json({ message: 'Concepto eliminado correctamente' });
  });
});

// Gestión de Proveedores
app.get('/proveedores', (req, res) => {
  db.query('SELECT * FROM proveedores', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener proveedores' });
    res.json(results);
  });
});

app.post('/proveedores', (req, res) => {
  const { nombre, tipo_persona, cedula_rnc, balance, estado } = req.body;
  const sql = 'INSERT INTO proveedores (nombre, tipo_persona, cedula_rnc, balance, estado) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nombre, tipo_persona, cedula_rnc, balance, estado], (err) => {
    if (err) return res.status(500).json({ error: 'Error al crear proveedor' });
    res.json({ message: 'Proveedor creado correctamente' });
  });
});

app.put('/proveedores/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, tipo_persona, cedula_rnc, balance, estado } = req.body;
  const sql = 'UPDATE proveedores SET nombre = ?, tipo_persona = ?, cedula_rnc = ?, balance = ?, estado = ? WHERE id = ?';
  db.query(sql, [nombre, tipo_persona, cedula_rnc, balance, estado, id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al editar proveedor' });
    res.json({ message: 'Proveedor actualizado correctamente' });
  });
});

app.delete('/proveedores/:id', (req, res) => {
  db.query('DELETE FROM proveedores WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar proveedor' });
    res.json({ message: 'Proveedor eliminado correctamente' });
  });
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});