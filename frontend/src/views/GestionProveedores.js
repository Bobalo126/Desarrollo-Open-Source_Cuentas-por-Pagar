
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Select, MenuItem } from '@mui/material';

function GestionProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [editando, setEditando] = useState(null);
  const [nuevo, setNuevo] = useState({
  nombre: '',
  tipo_persona: 'fisica',
  cedula_rnc: '',
  balance: '',
  estado: 'activo'
});

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const obtenerProveedores = () => {
    axios.get('http://localhost:3001/proveedores')
      .then(res => setProveedores(res.data))
      .catch(err => console.error('Error al obtener proveedores:', err));
  };

  const handleAgregar = () => {
  axios.post('http://localhost:3001/proveedores', nuevo)
    .then(() => {
      setNuevo({
        nombre: '',
        tipo_persona: 'fisica',
        cedula_rnc: '',
        balance: '',
        estado: 'activo'
      });
      obtenerProveedores();
    })
    .catch(err => console.error('Error al agregar:', err));
};


  const handleEdit = (id) => {
    const p = proveedores.find(pr => pr.id === id);
    setEditando({ ...p });
  };

  const handleGuardar = () => {
    axios.put(`http://localhost:3001/proveedores/${editando.id}`, editando)
      .then(() => {
        obtenerProveedores();
        setEditando(null);
      })
      .catch(err => console.error('Error al editar:', err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/proveedores/${id}`)
      .then(obtenerProveedores)
      .catch(err => console.error('Error al eliminar:', err));
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Gestión de Proveedores</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1em', marginBottom: '1em' }}>
      <TextField
        label="Nombre"
        value={nuevo.nombre}
        onChange={e => setNuevo({ ...nuevo, nombre: e.target.value })}
      />
      <Select
        value={nuevo.tipo_persona}
        onChange={e => setNuevo({ ...nuevo, tipo_persona: e.target.value })}
        displayEmpty
      >
        <MenuItem value="fisica">Física</MenuItem>
        <MenuItem value="juridica">Jurídica</MenuItem>
      </Select>
      <TextField
        label="Cédula/RNC"
        value={nuevo.cedula_rnc}
        onChange={e => setNuevo({ ...nuevo, cedula_rnc: e.target.value })}
      />
      <TextField
        label="Balance"
        type="number"
        value={nuevo.balance}
        onChange={e => setNuevo({ ...nuevo, balance: e.target.value })}
      />
      <Select
        value={nuevo.estado}
        onChange={e => setNuevo({ ...nuevo, estado: e.target.value })}
        displayEmpty
      >
        <MenuItem value="activo">Activo</MenuItem>
        <MenuItem value="inactivo">Inactivo</MenuItem>
      </Select>
      <Button variant="contained" onClick={handleAgregar}>Agregar</Button>
    </div>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Tipo</TableCell>
            <TableCell>Cédula/RNC</TableCell>
            <TableCell>Balance</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {proveedores.map((fila) => (
            <TableRow key={fila.id}>
              <TableCell>
                {editando?.id === fila.id ? (
                  <TextField value={editando.nombre} onChange={e => setEditando({ ...editando, nombre: e.target.value })} />
                ) : fila.nombre}
              </TableCell>
              <TableCell>
                {editando?.id === fila.id ? (
                  <Select value={editando.tipo_persona} onChange={e => setEditando({ ...editando, tipo_persona: e.target.value })}>
                    <MenuItem value="fisica">fisica</MenuItem>
                    <MenuItem value="juridica">juridica</MenuItem>
                  </Select>
                ) : fila.tipo_persona}
              </TableCell>
              <TableCell>
                {editando?.id === fila.id ? (
                  <TextField value={editando.cedula_rnc} onChange={e => setEditando({ ...editando, cedula_rnc: e.target.value })} />
                ) : fila.cedula_rnc}
              </TableCell>
              <TableCell>
                {editando?.id === fila.id ? (
                  <TextField type="number" value={editando.balance} onChange={e => setEditando({ ...editando, balance: e.target.value })} />
                ) : fila.balance}
              </TableCell>
              <TableCell>
                {editando?.id === fila.id ? (
                  <Select value={editando.estado} onChange={e => setEditando({ ...editando, estado: e.target.value })}>
                    <MenuItem value="activo">activo</MenuItem>
                    <MenuItem value="inactivo">inactivo</MenuItem>
                  </Select>
                ) : fila.estado}
              </TableCell>
              <TableCell>
                {editando?.id === fila.id ? (
                  <Button onClick={handleGuardar}>Guardar</Button>
                ) : (
                  <>
                    <Button onClick={() => handleEdit(fila.id)}>Editar</Button>
                    <Button color="error" onClick={() => handleDelete(fila.id)}>Eliminar</Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}

export default GestionProveedores;
