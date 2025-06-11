import React, { useState, useEffect } from 'react';

const ProveedorForm = ({ onAdd, proveedor }) => {
  const [form, setForm] = useState({
    id: '',
    nombre: '',
    tipoPersona: '',
    cedulaRNC: '',
    balance: '',
    estado: ''
  });

  useEffect(() => {
    if (proveedor) {
      setForm(proveedor);
    }
  }, [proveedor]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onAdd(form);
    setForm({ id: '', nombre: '', tipoPersona: '', cedulaRNC: '', balance: '', estado: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="formulario">
      <div className="campo">
        <label>ID</label>
        <input name="id" value={form.id} onChange={handleChange} required />
      </div>
      <div className="campo">
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required />
      </div>
      <div className="campo">
        <label>Tipo de persona</label>
        <input name="tipoPersona" value={form.tipoPersona} onChange={handleChange} required />
      </div>
      <div className="campo">
        <label>Cédula/RNC</label>
        <input name="cedulaRNC" value={form.cedulaRNC} onChange={handleChange} required />
      </div>
      <div className="campo">
        <label>Balance</label>
        <input name="balance" value={form.balance} onChange={handleChange} required />
      </div>
      <div className="campo">
        <label>Estado</label>
        <input name="estado" value={form.estado} onChange={handleChange} required />
      </div>
      <button type="submit">Agregar</button>
    </form>
  );
};

export default ProveedorForm;
