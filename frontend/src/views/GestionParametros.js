import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button,
  TextField, Select, MenuItem
} from '@mui/material';

function GestionParametros() {
  const [parametros, setParametros] = useState([]);
  const [nuevo, setNuevo] = useState({ anio_proceso: '', mes_proceso: '', cierre_ejecutado: 'no' });
  const [editando, setEditando] = useState(null);
  const [filtro, setFiltro] = useState({ anio: '', mes: '', cierre: '' });

  useEffect(() => {
    obtenerParametros();
  }, []);

  const obtenerParametros = () => {
    axios.get('http://localhost:3001/parametros')
      .then(res => setParametros(res.data))
      .catch(err => console.error('Error al obtener datos:', err));
  };

  const validarNuevo = () => {
    const anio = parseInt(nuevo.anio_proceso);
    const mes = parseInt(nuevo.mes_proceso);

    if (isNaN(anio) || anio < 1900 || anio > 2100) {
      alert('El año debe ser un número válido entre 1900 y 2100.');
      return false;
    }

    if (isNaN(mes) || mes < 1 || mes > 12) {
      alert('El mes debe estar entre 1 y 12.');
      return false;
    }

    if (!['si', 'no'].includes(nuevo.cierre_ejecutado)) {
      alert('Cierre ejecutado debe ser "si" o "no".');
      return false;
    }

    return true;
  };

  const handleCrear = () => {
    if (!validarNuevo()) return;

    axios.post('http://localhost:3001/parametros', nuevo)
      .then(() => {
        obtenerParametros();
        setNuevo({ anio_proceso: '', mes_proceso: '', cierre_ejecutado: 'no' });
      })
      .catch(err => console.error('Error al crear:', err));
  };

  const handleEdit = (anio, mes) => {
    const param = parametros.find(p => p.anio_proceso === anio && p.mes_proceso === mes);
    setEditando({
      ...param,
      originalAnio: param.anio_proceso,
      originalMes: param.mes_proceso
    });
  };

  const handleGuardar = () => {
    axios.put(`http://localhost:3001/parametros/${editando.originalAnio}/${editando.originalMes}`, {
      nuevo_anio: editando.anio_proceso,
      nuevo_mes: editando.mes_proceso,
      cierre_ejecutado: editando.cierre_ejecutado
    })
      .then(() => {
        obtenerParametros();
        setEditando(null);
      })
      .catch(err => console.error('Error al editar:', err));
  };

  const handleDelete = (anio, mes) => {
    const url = `http://localhost:3001/parametros/${anio}/${mes}`;
    axios.delete(url)
      .then(() => obtenerParametros())
      .catch(err => console.error('Error al borrar:', err));
  };

  const aplicarFiltro = (p) => {
    const matchAnio = filtro.anio === '' || p.anio_proceso.toString().includes(filtro.anio);
    const matchMes = filtro.mes === '' || p.mes_proceso.toString().includes(filtro.mes);
    const matchCierre = filtro.cierre === '' || p.cierre_ejecutado === filtro.cierre;
    return matchAnio && matchMes && matchCierre;
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestión de Parámetros</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <TextField label="Año" type="number" value={nuevo.anio_proceso}
          onChange={e => setNuevo({ ...nuevo, anio_proceso: e.target.value })} />
        <TextField label="Mes" type="number" value={nuevo.mes_proceso}
          onChange={e => setNuevo({ ...nuevo, mes_proceso: e.target.value })} />
        <Select value={nuevo.cierre_ejecutado}
          onChange={e => setNuevo({ ...nuevo, cierre_ejecutado: e.target.value })}>
          <MenuItem value="si">Sí</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleCrear}>Crear</Button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <TextField label="Filtrar Año" type="number" value={filtro.anio}
          onChange={e => setFiltro({ ...filtro, anio: e.target.value })} />
        <TextField label="Filtrar Mes" type="number" value={filtro.mes}
          onChange={e => setFiltro({ ...filtro, mes: e.target.value })} />
        <Select value={filtro.cierre}
          onChange={e => setFiltro({ ...filtro, cierre: e.target.value })} displayEmpty>
          <MenuItem value="">Todos</MenuItem>
          <MenuItem value="si">Sí</MenuItem>
          <MenuItem value="no">No</MenuItem>
        </Select>
        <Button variant="outlined" onClick={() => setFiltro({ anio: '', mes: '', cierre: '' })}>Limpiar</Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Año</TableCell>
              <TableCell>Mes</TableCell>
              <TableCell>Cierre Ejecutado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parametros.filter(aplicarFiltro).map((fila) => (
              <TableRow key={`${fila.anio_proceso}-${fila.mes_proceso}`}>
                <TableCell>
                  {editando && editando.originalAnio === fila.anio_proceso && editando.originalMes === fila.mes_proceso ? (
                    <TextField
                      type="number"
                      value={editando.anio_proceso}
                      onChange={e => setEditando({ ...editando, anio_proceso: e.target.value })}
                    />
                  ) : (
                    fila.anio_proceso
                  )}
                </TableCell>
                <TableCell>
                  {editando && editando.originalAnio === fila.anio_proceso && editando.originalMes === fila.mes_proceso ? (
                    <TextField
                      type="number"
                      value={editando.mes_proceso}
                      onChange={e => setEditando({ ...editando, mes_proceso: e.target.value })}
                    />
                  ) : (
                    fila.mes_proceso
                  )}
                </TableCell>
                <TableCell>
                  {editando && editando.originalAnio === fila.anio_proceso && editando.originalMes === fila.mes_proceso ? (
                    <Select
                      value={editando.cierre_ejecutado}
                      onChange={e => setEditando({ ...editando, cierre_ejecutado: e.target.value })}
                    >
                      <MenuItem value="si">Sí</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </Select>
                  ) : (
                    fila.cierre_ejecutado
                  )}
                </TableCell>
                <TableCell>
                  {editando && editando.originalAnio === fila.anio_proceso && editando.originalMes === fila.mes_proceso ? (
                    <Button onClick={handleGuardar}>Guardar</Button>
                  ) : (
                    <Button onClick={() => handleEdit(fila.anio_proceso, fila.mes_proceso)}>Editar</Button>
                  )}
                  <Button color="error" onClick={() => handleDelete(fila.anio_proceso, fila.mes_proceso)}>Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default GestionParametros;
