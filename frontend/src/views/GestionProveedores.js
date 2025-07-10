import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button,
  TextField, Select, MenuItem
} from '@mui/material';

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
  const [filtro, setFiltro] = useState({ texto: '', tipo: '', estado: '' });

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const obtenerProveedores = () => {
    axios.get('http://localhost:3001/proveedores')
      .then(res => setProveedores(res.data))
      .catch(err => console.error('Error al obtener proveedores:', err));
  };
  const validarCedula = (cedula) => {
  const vcCedula = cedula.replace(/-/g, '');
  if (vcCedula.length !== 11) return false;

  const digitoMult = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];
  let total = 0;

  for (let i = 0; i < 11; i++) {
    const digito = parseInt(vcCedula[i]);
    const multiplicado = digito * digitoMult[i];
    total += multiplicado < 10 ? multiplicado : Math.floor(multiplicado / 10) + (multiplicado % 10);
  }

  return total % 10 === 0;
};

  const validarRNC = (rnc) => {
  if (rnc.length !== 9) return false;

  const peso = [7, 9, 8, 6, 5, 4, 3, 2];
  let suma = 0;

  for (let i = 0; i < 8; i++) {
    const digito = parseInt(rnc[i]);
    if (isNaN(digito)) return false;
    suma += digito * peso[i];
  }

  const resto = suma % 11;
  let digitoVerificador;

  if (resto === 0) digitoVerificador = 2;
  else if (resto === 1) digitoVerificador = 1;
  else digitoVerificador = 11 - resto;

  return digitoVerificador === parseInt(rnc[8]);
};


  const validar = (p) => {
  if (!p.nombre.trim() || !p.cedula_rnc.trim()) {
    alert('Nombre y Cédula/RNC son obligatorios.');
    return false;
  }
  if (isNaN(p.balance) || Number(p.balance) < 0) {
    alert('El balance debe ser un número positivo.');
    return false;
  }

  const rncOCedula = p.cedula_rnc.replace(/-/g, '');
  if (p.tipo_persona === 'fisica' && !validarCedula(rncOCedula)) {
    alert('Cédula no válida.');
    return false;
  }
  if (p.tipo_persona === 'juridica' && !validarRNC(rncOCedula)) {
    alert('RNC no válido.');
    return false;
  }

  return true;
};


  const handleAgregar = () => {
    if (!validar(nuevo)) return;

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
    if (!validar(editando)) return;

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

  const filtrados = proveedores.filter(p => {
    const matchTexto =
      p.nombre.toLowerCase().includes(filtro.texto.toLowerCase()) ||
      p.cedula_rnc.toLowerCase().includes(filtro.texto.toLowerCase());
    const matchTipo = filtro.tipo === '' || p.tipo_persona === filtro.tipo;
    const matchEstado = filtro.estado === '' || p.estado === filtro.estado;
    return matchTexto && matchTipo && matchEstado;
  });

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Gestión de Proveedores</h2>
      <br/>
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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1em', marginBottom: '1em' }}>
        <TextField
          label="Buscar por nombre o RNC"
          value={filtro.texto}
          onChange={e => setFiltro({ ...filtro, texto: e.target.value })}
        />
        <Select
          value={filtro.tipo}
          onChange={e => setFiltro({ ...filtro, tipo: e.target.value })}
          displayEmpty
        >
          <MenuItem value="">Todos los tipos</MenuItem>
          <MenuItem value="fisica">Física</MenuItem>
          <MenuItem value="juridica">Jurídica</MenuItem>
        </Select>
        <Select
          value={filtro.estado}
          onChange={e => setFiltro({ ...filtro, estado: e.target.value })}
          displayEmpty
        >
          <MenuItem value="">Todos los estados</MenuItem>
          <MenuItem value="activo">Activo</MenuItem>
          <MenuItem value="inactivo">Inactivo</MenuItem>
        </Select>
        <Button variant="outlined" onClick={() => setFiltro({ texto: '', tipo: '', estado: '' })}>Limpiar</Button>
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
            {filtrados.map((fila) => (
              <TableRow key={fila.id}>
                <TableCell>
                  {editando?.id === fila.id ? (
                    <TextField
                      value={editando.nombre}
                      onChange={e => setEditando({ ...editando, nombre: e.target.value })}
                    />
                  ) : fila.nombre}
                </TableCell>
                <TableCell>
                  {editando?.id === fila.id ? (
                    <Select
                      value={editando.tipo_persona}
                      onChange={e => setEditando({ ...editando, tipo_persona: e.target.value })}
                    >
                      <MenuItem value="fisica">fisica</MenuItem>
                      <MenuItem value="juridica">juridica</MenuItem>
                    </Select>
                  ) : fila.tipo_persona}
                </TableCell>
                <TableCell>
                  {editando?.id === fila.id ? (
                    <TextField
                      value={editando.cedula_rnc}
                      onChange={e => setEditando({ ...editando, cedula_rnc: e.target.value })}
                    />
                  ) : fila.cedula_rnc}
                </TableCell>
                <TableCell>
                  {editando?.id === fila.id ? (
                    <TextField
                      type="number"
                      value={editando.balance}
                      onChange={e => setEditando({ ...editando, balance: e.target.value })}
                    />
                  ) : fila.balance}
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

export default GestionProveedores;