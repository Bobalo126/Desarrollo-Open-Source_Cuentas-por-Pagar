import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';

import Menu from './components/Menu';
import GestionConceptos from "./views/GestionConceptos";
import GestionParametros from "./views/GestionParametros";
import GestionProveedores from "./views/GestionProveedores";
import GestionDocumentos from "./views/GestionDocumentos";
import Usuarios from './views/GestionUsuarios';
import Login from './views/Login';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const isLoggedIn = !!user;

  return (
    <Routes>
      {!isLoggedIn && (
        <>
          <Route path="*" element={<Login />} />
        </>
      )}
      {isLoggedIn && (
        <>
          <Route path="/" element={<Navigate to="/sistema/gestion-parametros" />} />
          <Route path="/sistema" element={<Menu />}>
            <Route path="gestion-parametros" element={<GestionParametros />} />
            <Route path="gestion-proveedores" element={<GestionProveedores />} />
            <Route path="gestion-conceptos" element={<GestionConceptos />} />
            <Route path="gestion-documentos" element={<GestionDocumentos />} />
            <Route path="gestion-usuarios" element={<Usuarios />} />
          </Route>
        </>
      )}
    </Routes>
  );
}

export default App;
