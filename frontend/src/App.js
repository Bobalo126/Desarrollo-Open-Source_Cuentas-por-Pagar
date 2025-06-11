//@ts-nocheck
import './App.css';
import { BrowserRouter as Routes, Route} from "react-router-dom";
import Menu from './components/Menu';
import GestionConceptos from "./views/GestionConceptos";
import GestionParametros from "./views/GestionParametros";
import GestionProveedores from "./views/GestionProveedores";
import Login from './views/Login';



function App() {
  return (
    <Routes>
      {/* RUTA DE LOGIN (SIN MENU) */}
      <Route path="/" element={<Login />} />

      {/* RUTAS INTERNAS CON EL MENU */}
      <Route path="/sistema" element={<Menu />}>
        <Route path="gestion-parametros" element={<GestionParametros />} />
        <Route path="gestion-proveedores" element={<GestionProveedores />} />
        <Route path="gestion-conceptos" element={<GestionConceptos />} />
      </Route>
    </Routes>
  );
}

export default App;
