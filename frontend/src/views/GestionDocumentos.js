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

  const [filtro, setFiltro] = useState({
  proveedor_id: '',
  estado: ''
});


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
    if (!validarFormulario()) return;
    axios.post('http://localhost:3001/documentos', nuevo)
      .then(() => {
        setNuevo({
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
    console.log('Guardando documento:', editando)
 const datos = {
  numero_factura: editando.numero_factura,
  fecha_documento: editando.fecha_documento,
  monto: editando.monto,
  proveedor_id: editando.proveedor_id,
  estado: editando.estado
};

axios.put(`http://localhost:3001/documentos/${editando.id}`, datos)
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

  const aplicarFiltros = () => {
  const params = new URLSearchParams();

  if (filtro.proveedor_id) params.append('proveedor_id', filtro.proveedor_id);
  if (filtro.estado) params.append('estado', filtro.estado);

  axios.get(`http://localhost:3001/documentos?${params.toString()}`)
    .then(res => setDocumentos(res.data))
    .catch(err => console.error('Error al filtrar documentos:', err));
};

const limpiarFiltros = () => {
  setFiltro({ proveedor_id: '', estado: '' });
  obtenerDocumentos();
};

const validarFormulario = () => {
  if (!nuevo.numero_factura.trim()) {
    alert('El número de factura es obligatorio.');
    return false;
  }

  if (!nuevo.fecha_documento) {
    alert('La fecha del documento es obligatoria.');
    return false;
  }

  const montoNum = parseFloat(nuevo.monto);
  if (isNaN(montoNum) || montoNum <= 0) {
    alert('El monto debe ser un número positivo mayor a cero.');
    return false;
  }

  if (!nuevo.proveedor_id) {
    alert('Debe seleccionar un proveedor.');
    return false;
  }

  if (!['Pendiente', 'Pagado'].includes(nuevo.estado)) {
    alert('El estado debe ser Pendiente o Pagado.');
    return false;
  }

  return true;
};



  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Entrada de Documentos x Pagar</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1em', marginBottom: '1em' }}>
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

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1em', marginBottom: '1em' }}>
  <Select
    value={filtro.proveedor_id}
    onChange={e => setFiltro({ ...filtro, proveedor_id: e.target.value })}
    displayEmpty
  >
    <MenuItem value="">Todos los proveedores</MenuItem>
    {proveedores.map(p => (
      <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
    ))}
  </Select>

  <Select
    value={filtro.estado}
    onChange={e => setFiltro({ ...filtro, estado: e.target.value })}
    displayEmpty
  >
    <MenuItem value="">Todos los estados</MenuItem>
    <MenuItem value="Pendiente">Pendiente</MenuItem>
    <MenuItem value="Pagado">Pagado</MenuItem>
  </Select>

  <Button variant="outlined" onClick={() => aplicarFiltros()}>Buscar</Button>
  <Button variant="text" onClick={() => limpiarFiltros()}>Limpiar</Button>
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
                <TableCell>{doc.numero_documento}</TableCell>
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
