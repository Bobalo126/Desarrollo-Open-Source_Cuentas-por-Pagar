import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button} from '@mui/material';

function GestionParametros() {
  const [parametros, setParametros] = useState([]);

  // Cargar datos desde el backend (simulado por ahora)
  useEffect(() => {
    // Aquí usarías fetch('http://localhost:3001/parametros') si ya tienes el backend
    const datosSimulados = [
      { anio_proceso: 2024, mes_proceso: 11, cierre_ejecutado: 'no' },
      { anio_proceso: 2024, mes_proceso: 12, cierre_ejecutado: 'si' },
      { anio_proceso: 2025, mes_proceso: 3, cierre_ejecutado: 'si' },
    ];
    setParametros(datosSimulados);
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
          {parametros.map((fila) => (
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
