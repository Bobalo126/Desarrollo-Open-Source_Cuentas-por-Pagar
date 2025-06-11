import React from 'react';

const ProveedorList = ({ proveedores, onDelete, onEdit }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Nombre</th><th>Tipo</th><th>Cédula/RNC</th><th>Balance</th><th>Estado</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {proveedores.map(p => (
          <tr key={p.id}>
            <td>{p.id}</td>
            <td>{p.nombre}</td>
            <td>{p.tipoPersona}</td>
            <td>{p.cedulaRNC}</td>
            <td>{p.balance}</td>
            <td>{p.estado}</td>
            <td>
              <button onClick={() => onEdit(p)}>Editar</button>
              <button onClick={() => onDelete(p.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProveedorList;
