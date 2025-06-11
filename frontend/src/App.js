//@ts-nocheck
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Menu from './components/Menu';
import GestionConceptos from "./views/GestionConceptos";
import GestionParametros from "./views/GestionParametros";
import GestionProveedores from "./views/GestionProveedores";
import Login from './views/Login';



function App() {
  return (
    <Router>
      <Routes>
        {/* Redirigir "/" a "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Login independiente */}
        <Route path="/login" element={<Login />} />

        {/* Páginas del sistema */}
        <Route
          path="/gestion-conceptos"
          element={
            <>
              <Menu />
              <GestionConceptos />
            </>
          }
        />
        <Route
          path="/gestion-proveedores"
          element={
            <>
              <Menu />
              <GestionProveedores />
            </>
          }
        />
        <Route
          path="/gestion-parametros"
          element={
            <>
              <Menu />
              <GestionParametros />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
