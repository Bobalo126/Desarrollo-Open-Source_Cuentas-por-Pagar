import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField, Select, MenuItem, Button,
  TableContainer, Table, TableHead, TableRow,
  TableCell, TableBody, Paper
} from '@mui/material';

function GestionDocumentos() {
  const [documentos, setDocumentos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [nuevo, setNuevo] = useState({
    numero_documento: '',
    numero_factura: '',
    fecha_documento: '',
    monto: '',
    proveedor_id: '',
    estado: 'Pendiente'
  });
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    obtenerDocumentos();
    obtenerProveedores();
  }, []);

  const obtenerDocumentos = () => {
    axios.get('http://localhost:3001/documentos')
      .then(res => setDocumentos(res.data))
      .catch(err => console.error('Error al obtener documentos:', err));
  };

  const obtenerProveedores = () => {
    axios.get('http://localhost:3001/proveedores')
      .then(res => setProveedores(res.data))
      .catch(err => console.error('Error al obtener proveedores:', err));
  };

  const handleAgregar = () => {
    axios.post('http://localhost:3001/documentos', nuevo)
      .then(() => {
        setNuevo({
          numero_documento: '',
          numero_factura: '',
          fecha_documento: '',
          monto: '',
          proveedor_id: '',
          estado: 'Pendiente'
        });
        obtenerDocumentos();
      })
      .catch(err => console.error('Error al agregar:', err));
  };

  const handleEdit = (id) => {
    const d = documentos.find(doc => doc.id === id);
    setEditando({ ...d });
  };

  const handleGuardar = () => {
    axios.put(`http://localhost:3001/documentos/${editando.id}`, editando)
      .then(() => {
        setEditando(null);
        obtenerDocumentos();
      })
      .catch(err => console.error('Error al editar:', err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/documentos/${id}`)
      .then(obtenerDocumentos)
      .catch(err => console.error('Error al eliminar:', err));
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Entrada de Documentos x Pagar</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1em', marginBottom: '1em' }}>
        <TextField
          label="No. Documento"
          value={nuevo.numero_documento}
          onChange={e => setNuevo({ ...nuevo, numero_documento: e.target.value })}
        />
        <TextField
          label="No. Factura"
          value={nuevo.numero_factura}
          onChange={e => setNuevo({ ...nuevo, numero_factura: e.target.value })}
        />
        <TextField
          label="Fecha Documento"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={nuevo.fecha_documento}
          onChange={e => setNuevo({ ...nuevo, fecha_documento: e.target.value })}
        />
        <TextField
          label="Monto"
          type="number"
          value={nuevo.monto}
          onChange={e => setNuevo({ ...nuevo, monto: e.target.value })}
        />
        <Select
          value={nuevo.proveedor_id}
          onChange={e => setNuevo({ ...nuevo, proveedor_id: e.target.value })}
          displayEmpty
        >
          <MenuItem value="" disabled>Seleccione proveedor</MenuItem>
          {proveedores.map(p => (
            <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
          ))}
        </Select>
        <Select
          value={nuevo.estado}
          onChange={e => setNuevo({ ...nuevo, estado: e.target.value })}
        >
          <MenuItem value="Pendiente">Pendiente</MenuItem>
          <MenuItem value="Pagado">Pagado</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleAgregar}>Agregar</Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No. Documento</TableCell>
              <TableCell>No. Factura</TableCell>
              <TableCell>Fecha Documento</TableCell>
              <TableCell>Monto</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documentos.map(doc => (
              <TableRow key={doc.id}>
                <TableCell>
                  {editando?.id === doc.id
                    ? <TextField value={editando.numero_documento} onChange={e => setEditando({ ...editando, numero_documento: e.target.value })} />
                    : doc.numero_documento}
                </TableCell>
                <TableCell>
                  {editando?.id === doc.id
                    ? <TextField value={editando.numero_factura} onChange={e => setEditando({ ...editando, numero_factura: e.target.value })} />
                    : doc.numero_factura}
                </TableCell>
                <TableCell>
                  {editando?.id === doc.id
                    ? <TextField type="date" value={editando.fecha_documento?.split('T')[0]} onChange={e => setEditando({ ...editando, fecha_documento: e.target.value })} />
                    : doc.fecha_documento?.split('T')[0]}
                </TableCell>
                <TableCell>
                  {editando?.id === doc.id
                    ? <TextField type="number" value={editando.monto} onChange={e => setEditando({ ...editando, monto: e.target.value })} />
                    : doc.monto}
                </TableCell>
                <TableCell>
                  {editando?.id === doc.id
                    ? <Select value={editando.proveedor_id} onChange={e => setEditando({ ...editando, proveedor_id: e.target.value })}>
                        {proveedores.map(p => (
                          <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                        ))}
                      </Select>
                    : doc.proveedor_nombre}
                </TableCell>
                <TableCell>
                  {editando?.id === doc.id
                    ? <Select value={editando.estado} onChange={e => setEditando({ ...editando, estado: e.target.value })}>
                        <MenuItem value="Pendiente">Pendiente</MenuItem>
                        <MenuItem value="Pagado">Pagado</MenuItem>
                      </Select>
                    : doc.estado}
                </TableCell>
                <TableCell>
                  {editando?.id === doc.id
                    ? <Button onClick={handleGuardar}>Guardar</Button>
                    : <>
                        <Button onClick={() => handleEdit(doc.id)}>Editar</Button>
                        <Button color="error" onClick={() => handleDelete(doc.id)}>Eliminar</Button>
                      </>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default GestionDocumentos;
