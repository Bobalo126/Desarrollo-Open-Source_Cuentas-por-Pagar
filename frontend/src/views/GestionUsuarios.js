import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Button,
  Select, MenuItem, TextField, Box
} from '@mui/material';
import axios from 'axios';

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState({ nombre: '', correo: '' });

  useEffect(() => {
    axios.get('http://localhost:3001/usuarios')
      .then(res => setUsuarios(res.data))
      .catch(err => console.error('Error al cargar usuarios', err));
  }, []);

  const cambiarRol = (id, nuevoRol) => {
    axios.put(`http://localhost:3001/usuarios/${id}/rol`, { rol: nuevoRol })
      .then(() => {
        setUsuarios(usuarios.map(u => u.id === id ? { ...u, rol: nuevoRol } : u));
      })
      .catch(err => console.error('Error al actualizar rol', err));
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(filtro.nombre.toLowerCase()) &&
    u.correo.toLowerCase().includes(filtro.correo.toLowerCase())
  );

  return (
    <Box>
      <h2>Gestión de Usuarios</h2>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Filtrar por nombre"
          value={filtro.nombre}
          onChange={e => setFiltro({ ...filtro, nombre: e.target.value })}
        />
        <TextField
          label="Filtrar por correo"
          value={filtro.correo}
          onChange={e => setFiltro({ ...filtro, correo: e.target.value })}
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Correo</TableCell>
            <TableCell>Rol</TableCell>
            <TableCell>Última sesión</TableCell>
            <TableCell>Cambiar rol</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usuariosFiltrados.map(usuario => (
            <TableRow key={usuario.id}>
              <TableCell>{usuario.nombre}</TableCell>
              <TableCell>{usuario.correo}</TableCell>
              <TableCell>{usuario.rol}</TableCell>
              <TableCell>{new Date(usuario.ultima_sesion).toLocaleString()}</TableCell>
              <TableCell>
                <Select
                  value={usuario.rol}
                  onChange={e => cambiarRol(usuario.id, e.target.value)}
                >
                  <MenuItem value="usuario">Usuario</MenuItem>
                  <MenuItem value="admin">Administrador</MenuItem>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

export default GestionUsuarios;