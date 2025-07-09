import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField, Select, MenuItem, Button,
  TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';

function GestionConceptos() {
  const [conceptos, setConceptos] = useState([]);
  const [nuevo, setNuevo] = useState({ descripcion: '', estado: 'activo' });
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState({ descripcion: '', estado: '' });

  useEffect(() => {
    obtenerConceptos();
  }, []);

  const obtenerConceptos = () => {
    axios.get('http://localhost:3001/conceptos')
      .then(res => setConceptos(res.data))
      .catch(err => console.error('Error al obtener conceptos:', err));
  };

  const validarConcepto = () => {
    if (!nuevo.descripcion.trim()) {
      alert('La descripción es obligatoria.');
      return false;
    }
    if (!['activo', 'inactivo'].includes(nuevo.estado)) {
      alert('El estado debe ser "activo" o "inactivo".');
      return false;
    }
    return true;
  };

  const handleAgregar = () => {
    if (!validarConcepto()) return;

    axios.post('http://localhost:3001/conceptos', nuevo)
      .then(() => {
        setNuevo({ descripcion: '', estado: 'activo' });
        obtenerConceptos();
      })
      .catch(err => console.error('Error al agregar:', err));
  };

  const handleEdit = (id) => {
    const c = conceptos.find(cp => cp.id === id);
    setEditando({ ...c });
  };

  const handleGuardar = () => {
    axios.put(`http://localhost:3001/conceptos/${editando.id}`, {
      descripcion: editando.descripcion,
      estado: editando.estado
    }).then(() => {
      obtenerConceptos();
      setEditando(null);
    }).catch(err => console.error('Error al editar:', err));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:3001/conceptos/${id}`)
      .then(obtenerConceptos)
      .catch(err => console.error('Error al eliminar:', err));
  };

  const aplicarFiltro = (c) => {
    const descMatch = c.descripcion.toLowerCase().includes(filtro.descripcion.toLowerCase());
    const estadoMatch = filtro.estado === '' || c.estado === filtro.estado;
    return descMatch && estadoMatch;
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Gestión de Conceptos</h2>

      <div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>
        <TextField
          label="Descripción"
          value={nuevo.descripcion}
          onChange={e => setNuevo({ ...nuevo, descripcion: e.target.value })}
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

      <div style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>
        <TextField
          label="Buscar descripción"
          value={filtro.descripcion}
          onChange={e => setFiltro({ ...filtro, descripcion: e.target.value })}
        />
        <Select
          value={filtro.estado}
          onChange={e => setFiltro({ ...filtro, estado: e.target.value })}
          displayEmpty
        >
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="activo">Activo</MenuItem>
          <MenuItem value="inactivo">Inactivo</MenuItem>
        </Select>
        <Button variant="outlined" onClick={() => setFiltro({ descripcion: '', estado: '' })}>Limpiar</Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Descripción</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {conceptos.filter(aplicarFiltro).map((fila) => (
              <TableRow key={fila.id}>
                <TableCell>
                  {editando?.id === fila.id ? (
                    <TextField
                      value={editando.descripcion}
                      onChange={e => setEditando({ ...editando, descripcion: e.target.value })}
                    />
                  ) : fila.descripcion}
                </TableCell>
                <TableCell>
                  {editando?.id === fila.id ? (
                    <Select
                      value={editando.estado}
                      onChange={e => setEditando({ ...editando, estado: e.target.value })}
                    >
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

export default GestionConceptos;