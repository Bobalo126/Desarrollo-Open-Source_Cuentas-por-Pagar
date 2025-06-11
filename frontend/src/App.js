//@ts-nocheck
import './App.css';
import { Routes, Route} from "react-router-dom";
import Menu from './components/Menu';
import GestionConceptos from "./views/GestionConceptos";
import GestionParametros from "./views/GestionParametros";
import GestionProveedores from "./views/GestionProveedores";
import Login from './views/Login';



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/sistema" element={<Menu />}>
        <Route path="gestion-parametros" element={<GestionParametros />} />
        <Route path="gestion-proveedores" element={<GestionProveedores />} />
        <Route path="gestion-conceptos" element={<GestionConceptos />} />
      </Route>
    </Routes>
  );
}

export default App;
