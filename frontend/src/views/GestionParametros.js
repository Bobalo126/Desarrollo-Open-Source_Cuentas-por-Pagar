import { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button} from '@mui/material';

function GestionParametros() {
  const [datos, setDatos] = useState([]);

  // Cargar datos desde el backend
  useEffect(() => {
    axios.get('http://localhost:3001/parametros')
      .then(res => setDatos(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleEdit = (anio, mes) => {
    console.log('Editar:', anio, mes);
    // Aquí abrirías un formulario de edición
  };

  const handleDelete = (anio, mes) => {
    console.log('Eliminar:', anio, mes);
    // Aquí enviarías una petición DELETE al backend
  };

  return (
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
          {datos.map((fila) => (
            <TableRow key={`${fila.anio_proceso}-${fila.mes_proceso}`}>
              <TableCell>{fila.anio_proceso}</TableCell>
              <TableCell>{fila.mes_proceso}</TableCell>
              <TableCell>{fila.cierre_ejecutado}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(fila.anio_proceso, fila.mes_proceso)}>Editar</Button>
                <Button color="error" onClick={() => handleDelete(fila.anio_proceso, fila.mes_proceso)}>Eliminar</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GestionParametros;
