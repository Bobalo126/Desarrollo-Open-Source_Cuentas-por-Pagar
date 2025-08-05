// Importamos las librerías necesarias para crear el servidor y conectarlo a la base de datos
const express = require('express'); // Librería para manejar rutas y solicitudes HTTP
const mysql = require('mysql2'); // Librería para conectarnos a MySQL
const cors = require('cors'); // Librería para permitir conexiones del frontend

const app = express(); //Iniciamos express. Con "app" es que haremos las funciones
app.use(cors()); //Hacemos que express use cors para que pueda aceptar cualquier solicitud
app.use(express.json()); //Permitimos que se puedan enviar datos en formato JSON desde el frontend

const db = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'admin',          
  database: 'cuentasporpagar' 
  //Tienen que crear un servidor con estos datos para que funcione el programa
});

//Para probar la conexión al servidor
db.connect(error => {
  if (error) {
    console.error('Error conectando a MySQL:', error);
  } else {
    console.log('Conectado exitosamente a MySQL');
  }
});
//Con Express se pueden usar funciones de un CRUD con las funciones get(sacar datos), post(agregar datos), put(editar datos) y delete(borrar datos).

// ===================== GESTIÓN DE PARÁMETROS =====================
// Esta ruta maneja solicitudes GET a la URL '/parametros'. Cuando el frontend hace una solicitud GET a esa ruta, esta función se ejecuta automáticamente.

// 'req' representa la solicitud del cliente (no se usa aquí porque no necesitamos datos de entrada).
// 'res' es la respuesta que le devolveremos al cliente, ya sea un mensaje de error o los datos que pidió.
app.get('/parametros', (req, res) => {
// Aquí escribimos el comando SQL que queremos ejecutar.
  const sql = 'SELECT * FROM parametros';
// Ejecutamos la consulta con db.query, que es una función especial de mysql2.
// Esta función espera:
// - El string con el comando SQL.
// - Una función (callback) que se ejecuta automáticamente cuando la base de datos responde.
//
// mysql2 se encarga de llamar esa función con dos valores:
// - 'err': Si ocurre un error, se guarda aquí.
// - 'results': Si todo sale bien, aquí estarán los datos de la base de datos.
  db.query(sql, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Error en la base de datos' });
        // Error 500 = algo falló dentro del servidor, datos vacíos o inválidos por ejemplo.
      } else {
        res.json(results); // Enviamos los datos al frontend como JSON para que puedan mostrarse en una tabla o lista
      }
  });
});

// Creamos las variables para año, mes y si está cerrado. 
// Esta ruta maneja solicitudes POST(Create de CRUD) a la URL '/parametros'.
// Cuando el frontend hace una solicitud POST, envía datos en el .body(como un JSON) en la solicitud
// 'req.body' contiene esos valores y los usamos para insertarlos en la base de datos
app.post('/parametros', (req, res) => {
  // Extraemos los datos del JSON en req.body para obtener los datos que nos interesan.
  const { anio_proceso, mes_proceso, cierre_ejecutado } = req.body;
  // Extraemos los datos enviados por el frontend y los insertamos en la base de datos.
  const sql = 'INSERT INTO parametros (anio_proceso, mes_proceso, cierre_ejecutado) VALUES (?, ?, ?)';
  // En el SQL usamos '?' como espacios reservados para insertar los valores en orden y de forma segura evitando el SQL injection.

  // Ejecutamos el query con los valores recibidos
  db.query(sql, [anio_proceso, mes_proceso, cierre_ejecutado], (err, result) => {
    if (err) {
      // Si algo falla, se responde con error al frontend
      console.error('Error al insertar:', err);
      res.status(500).json({ error: 'Error al insertar el parámetro' });
    } else {
      // Si todo va bien, se confirma el éxito
      res.json({ message: 'Parámetro creado correctamente' });
    }
  });
});

// Creamos las variables para actualizar un parámetro existente.
// Esta ruta maneja solicitudes PUT (Update de CRUD) a la URL '/parametros/:anio/:mes'.
// El frontend manda los valores nuevos en el .body como JSON, y el año/mes original en la URL.
// 'req.params' contiene los valores que vienen en la URL (:anio y :mes), sirven para identificar el registro que queremos modificar.
// 'req.body' trae los nuevos datos que queremos guardar (nuevo año, nuevo mes, y si está cerrado).
app.put('/parametros/:anio/:mes', (req, res) => {
  const { anio, mes } = req.params;
  const { nuevo_anio, nuevo_mes, cierre_ejecutado } = req.body;

  // Consulta SQL para actualizar el parámetro según el año y mes actual.
  const sql = `UPDATE parametros
    SET anio_proceso = ?, mes_proceso = ?, cierre_ejecutado = ?
    WHERE anio_proceso = ? AND mes_proceso = ?`;

    // Ejecutamos el query con los nuevos valores primero, y los valores originales después. 
    // Recordar que se tienen que mandar los datos al SQL en el mismo orden que tienen las '?'.
  db.query(sql, [nuevo_anio, nuevo_mes, cierre_ejecutado, anio, mes], (err, result) => {
    if (err) {
      console.error('Error al actualizar el parámetro:', err);
      return res.status(500).json({ error: 'Error al actualizar el parámetro' });
    }
    res.json({ message: 'Parámetro actualizado correctamente' });
  });
});

// Creamos las variables para eliminar un parámetro.
// Esta ruta maneja solicitudes DELETE a la URL '/parametros/:anio/:mes' y así encontrar que variable eliminar.
app.delete('/parametros/:anio/:mes', (req, res) => {
  // 'req.params' contiene esos valores que vienen en la URL (:anio y :mes).
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
// Creamos las funciones para gestionar los Conceptos de Pago (como "Alquiler", "Servicios", etc).

// Esta ruta maneja solicitudes GET (Read de CRUD) a la URL '/conceptos'.
// No se necesitan datos extra, simplemente devuelve todos los conceptos guardados.
app.get('/conceptos', (req, res) => {
  db.query('SELECT * FROM conceptospago', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener conceptos' });
    res.json(results); // Enviamos los conceptos como JSON al frontend
  });
});

// Esta ruta maneja solicitudes POST (Create de CRUD) a la URL '/conceptos'.
// El frontend envía los datos en el .body como JSON. Usamos esos datos para crear un nuevo concepto.
app.post('/conceptos', (req, res) => {
  const { descripcion, estado } = req.body; // Extraemos los datos enviados por el frontend
  const sql = 'INSERT INTO conceptospago (descripcion, estado) VALUES (?, ?)'; 
  // Usamos '?' para insertar los valores de forma segura y evitar SQL injection.
  db.query(sql, [descripcion, estado], (err) => {
    if (err) return res.status(500).json({ error: 'Error al crear concepto' }); // Error 500 = algo falló en el backend
    res.json({ message: 'Concepto creado correctamente' });
  });
});

// Esta ruta maneja solicitudes PUT (Update de CRUD) a la URL '/conceptos/:id'.
// 'req.params' nos da el ID del concepto que se va a modificar. Los nuevos datos vienen en 'req.body'.
app.put('/conceptos/:id', (req, res) => {
  const { id } = req.params;
  const { descripcion, estado } = req.body;
  const sql = 'UPDATE conceptospago SET descripcion = ?, estado = ? WHERE id = ?';
  db.query(sql, [descripcion, estado, id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al editar concepto' });
    res.json({ message: 'Concepto actualizado correctamente' });
  });
});

// Esta ruta maneja solicitudes DELETE a la URL '/conceptos/:id'.
// Se usa para eliminar un concepto por su ID, el cual se recibe desde la URL.
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

// Esta ruta maneja solicitudes GET (Read de CRUD) a la URL '/documentos'.
app.get('/documentos', (req, res) => {

  const sql = `
    SELECT d.*, p.nombre AS proveedor_nombre 
    FROM documentos d
    JOIN proveedores p ON d.proveedor_id = p.id
  `;
  // Consulta SQL que obtiene todos los documentos junto con el nombre del proveedor relacionado.
  // Se usa JOIN para combinar la tabla documentos (d) con la tabla proveedores (p) según su ID.

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener documentos' });
    res.json(results);
  });
});

// Esta ruta maneja solicitudes POST (Create de CRUD) a la URL '/documentos'.
// El frontend envía los datos en el body como JSON. Usamos esos datos para registrar un nuevo documento.
// También se genera automáticamente el número de documento con el formato DOC-00001 por ejemplo.
app.post('/documentos', (req, res) => {
  // Extraemos los campos enviados por el frontend
  const { numero_factura, fecha_documento, monto, proveedor_id, estado } = req.body;
  const fecha_registro = new Date().toISOString().slice(0, 10);// Y creamos la fecha actual en formato YYYY-MM-DD

  // Consulta SQL para insertar el documento en la base de datos
  const insertSql = `
    INSERT INTO documentos 
    (numero_factura, fecha_documento, monto, fecha_registro, proveedor_id, estado) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  // Ejecutamos la inserción. Si no se especifica estado, se asigna 'Pendiente' por defecto.
  db.query(insertSql, [numero_factura, fecha_documento, monto, fecha_registro, proveedor_id, estado || 'Pendiente'], (err, result) => {
    if (err) {
  console.error('Error en INSERT:', err);
  return res.status(500).json({ error: 'Error al crear documento', detalle: err.message });
}

    const id = result.insertId;
    const numero_documento = `DOC-${String(id).padStart(5, '0')}`;
    // Creamos un número de documento como 'DOC-00023' usando el ID insertado, rellenando con ceros a la izquierda para que siempre tenga 5 dígitos con .padStart

    const updateSql = `UPDATE documentos SET numero_documento = ? WHERE id = ?`;
    // Actualizamos el registro insertado para agregarle el número_documento generado
    db.query(updateSql, [numero_documento, id], (err2) => {
      if (err2) return res.status(500).json({ error: 'Error al asignar número de documento' });

      res.json({ message: 'Documento creado con número automático', numero_documento });
    });
  });
});

// Esta ruta maneja solicitudes PUT (Update de CRUD) a la URL '/documentos/:id'.
// El ID del documento a modificar viene en la URL (:id), y los nuevos valores vienen en el body como JSON.
app.put('/documentos/:id', (req, res) => {
  let { numero_factura, fecha_documento, monto, proveedor_id, estado } = req.body;
  // Algunas librerías de frontend pueden mandar la fecha en formato largo: '2025-08-02T00:00:00.000Z'.
  // Aquí limpiamos la fecha para quedarnos solo con el formato YYYY-MM-DD.
  fecha_documento = fecha_documento.split('T')[0];

  // Consulta SQL para actualizar el documento según su ID  
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

//Gestion de usuarios

// Esta ruta maneja solicitudes POST para login con Google.
// El frontend envía nombre y correo del usuario autenticado por Google.
// Si el usuario no existe en la base de datos, se crea.
// Si ya existe, se actualiza la fecha de su última sesión.
app.post('/login-google', (req, res) => {
  const { nombre, correo } = req.body;
  const fecha = new Date(); // Fecha y hora actual para registrar la sesión

  // Verificamos si ya existe un usuario con ese correo
  db.query(
    'SELECT * FROM usuarios WHERE correo = ?', [correo], (err, results) => {
      if (err) return res.status(500).json({ error: 'Error en consulta' });

      if (results.length === 0) {
        // si no existe lo creamos
        db.query(
          'INSERT INTO usuarios (nombre, correo, ultima_sesion) VALUES (?, ?, ?)',
          [nombre, correo, fecha],
          (err2) => {
            if (err2) return res.status(500).json({ error: 'Error al registrar usuario' });
            return res.json({ rol: 'usuario' });
            // Enviamos al frontend el rol del usuario para que decida qué vista mostrar. Por defecto, se asigna rol "usuario"
          }
        );
      } else {
        // Ya existe: actualizamos última sesión
        db.query(
          'UPDATE usuarios SET ultima_sesion = ? WHERE correo = ?',
          [fecha, correo],
          (err3) => {
            if (err3) return res.status(500).json({ error: 'Error al actualizar sesión' });
            return res.json({ rol: results[0].rol });
          }
        );
      }
    }
  );
});

// Obtener todos los usuarios

// Esta ruta maneja solicitudes GET (Read de CRUD) a la URL '/usuarios'.
// Devuelve todos los usuarios registrados en la base de datos.
app.get('/usuarios', (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al cargar usuarios' });
    res.json(results);
  });
});

// Actualizar rol

// Esta ruta maneja solicitudes PUT (Update de CRUD) a la URL '/usuarios/:id/rol'.
// Se usa para actualizar el rol de un usuario. El ID viene en la URL, y el nuevo rol en el body.
app.put('/usuarios/:id/rol', (req, res) => {
  const { rol } = req.body;
  db.query('UPDATE usuarios SET rol = ? WHERE id = ?', [rol, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar rol' });
    res.json({ message: 'Rol actualizado' });
  });
});

app.get('/api/facturas', (req, res) => {
  const sql = 'SELECT * FROM facturas';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener facturas:', err);
      return res.status(500).json({ error: 'Error al obtener facturas' });
    }
    res.json(results);
  });
});

// Obtener documentos pendientes (estado = 'Pendiente')
app.get('/pagos/pendientes', (req, res) => {
  const sql = `
    SELECT d.id, d.numero_factura, p.nombre AS proveedor, d.monto
    FROM documentos d
    JOIN proveedores p ON d.proveedor_id = p.id
    WHERE d.estado = 'Pendiente'
  `;


  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al cargar documentos pendientes:', err);
      return res.status(500).json({ error: 'Error al obtener documentos pendientes' });
    }
    res.json(results);
  });
});

// Procesar pago
app.post('/pagos/procesar', (req, res) => {
  const { documentos, fecha_pago, concepto } = req.body;

  if (!fecha_pago || !concepto || documentos.length === 0) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  const insertSql = `
    INSERT INTO solicitudes_cheques (proveedor, fecha_pago, monto, concepto)
    VALUES (?, ?, ?, ?)
  `;

  documentos.forEach((doc) => {
    db.query(
      insertSql,
      [doc.proveedor, fecha_pago, doc.monto, concepto],
      (err) => {
        if (err) console.error('Error al guardar solicitud:', err);
      }
    );

    // Marcar el documento como "Pagado"
    db.query('UPDATE documentos SET estado = "Pagado" WHERE id = ?', [doc.id], (err) => {
      if (err) console.error('Error al actualizar estado del documento:', err);
    });
  });

  res.json({ message: 'Pago procesado correctamente' });
});



// Iniciamos el servidor en el puerto 3001. Esto permite que el backend escuche solicitudes del frontend mandadas a este puerto.
// Se puede cambiar este número si se necesita usar otro puerto disponible (ej. 3002, 8080, etc.)
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});