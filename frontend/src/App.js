import React, { useState, useEffect } from 'react';
import ProveedorForm from './components/ProveedorForm';
import ProveedorList from './components/ProveedorList';

function App() {
  const [proveedores, setProveedores] = useState(() => {
    const data = localStorage.getItem('proveedores');
    return data ? JSON.parse(data) : [];
  });

  const [editando, setEditando] = useState(null);

  useEffect(() => {
    localStorage.setItem('proveedores', JSON.stringify(proveedores));
  }, [proveedores]);

  const agregarProveedor = (nuevo) => {
    if (editando && nuevo.id === editando.id) {
      setProveedores(proveedores.map(p => p.id === nuevo.id ? nuevo : p));
      setEditando(null);
    } else {
      setProveedores([...proveedores, nuevo]);
    }
  };

  const eliminarProveedor = (id) => {
    setProveedores(proveedores.filter(p => p.id !== id));
  };

  const editarProveedor = (proveedor) => {
    setEditando(proveedor);
  };

  return (
    <div className="App">
      <h1>Gestión de Proveedores</h1>
      <ProveedorForm onAdd={agregarProveedor} proveedor={editando} />
      <ProveedorList
        proveedores={proveedores}
        onDelete={eliminarProveedor}
        onEdit={editarProveedor}
      />
    </div>
  );
}

export default App;
