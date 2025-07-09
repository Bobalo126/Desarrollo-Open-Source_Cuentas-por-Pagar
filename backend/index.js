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

// Gestión de Entrada de Documentos x Pagar
app.get('/documentos', (req, res) => {
  const { proveedor_id, estado } = req.query;

  let sql = `
    SELECT d.*, p.nombre AS proveedor_nombre 
    FROM documentos d
    JOIN proveedores p ON d.proveedor_id = p.id
    WHERE 1=1
  `;
  const params = [];

  if (proveedor_id) {
    sql += ' AND d.proveedor_id = ?';
    params.push(proveedor_id);
  }

  if (estado) {
    sql += ' AND d.estado = ?';
    params.push(estado);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener documentos' });
    res.json(results);
  });
});


app.post('/documentos', (req, res) => {
  //console.log("Datos recibidos:", req.body);
  const { numero_factura, fecha_documento, monto, proveedor_id, estado } = req.body;
  const fecha_registro = new Date().toISOString().slice(0, 10);

  const insertSql = `
    INSERT INTO documentos 
    (numero_factura, fecha_documento, monto, fecha_registro, proveedor_id, estado) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
//console.log('Insertando con:', numero_factura, fecha_documento, monto, fecha_registro, proveedor_id, estado);

  db.query(insertSql, [numero_factura, fecha_documento, monto, fecha_registro, proveedor_id, estado || 'Pendiente'], (err, result) => {
    if (err) {
  console.error('Error en INSERT:', err);
  return res.status(500).json({ error: 'Error al crear documento', detalle: err.message });
}

    const id = result.insertId;
    const numero_documento = `DOC-${String(id).padStart(5, '0')}`;

    const updateSql = `UPDATE documentos SET numero_documento = ? WHERE id = ?`;
    db.query(updateSql, [numero_documento, id], (err2) => {
      if (err2) return res.status(500).json({ error: 'Error al asignar número de documento' });

      res.json({ message: 'Documento creado con número automático', numero_documento });
    });
  });
});



app.put('/documentos/:id', (req, res) => {
  let { numero_factura, fecha_documento, monto, proveedor_id, estado } = req.body;
  fecha_documento = fecha_documento.split('T')[0];

  console.log('Datos recibidos en PUT:', req.body);
  console.log('ID recibido por params:', req.params.id);

  const sql = `
    UPDATE documentos
    SET numero_factura = ?, fecha_documento = ?, monto = ?, proveedor_id = ?, estado = ?
    WHERE id = ?
  `;

  db.query(sql, [numero_factura, fecha_documento, monto, proveedor_id, estado, req.params.id], (err) => {
    if (err) {
      console.error('Error en UPDATE:', err);
      return res.status(500).json({ error: 'Error al actualizar documento', detalle: err.message });
    }

    res.json({ message: 'Documento actualizado correctamente' });
  });
});

app.delete('/documentos/:id', (req, res) => {
  db.query('DELETE FROM documentos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar documento' });
    res.json({ message: 'Documento eliminado correctamente' });
  });
});


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});