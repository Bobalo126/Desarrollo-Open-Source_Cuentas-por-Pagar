import { Link, Outlet } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, Box, Button } from "@mui/material";
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useState } from "react";

const drawerWidth = 240;

export default function Menu() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    console.log("Usuario logueado:", decoded);
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          <ListItem button component={Link} to="/sistema/gestion-conceptos">
            <ListItemText primary="Gestión de Conceptos" />
          </ListItem>
          <ListItem button component={Link} to="/sistema/gestion-proveedores">
            <ListItemText primary="Gestión de Proveedores" />
          </ListItem>
          <ListItem button component={Link} to="/sistema/gestion-parametros">
            <ListItemText primary="Gestión de Parámetros" />
          </ListItem>
          <ListItem button component={Link} to="/sistema/gestion-documentos">
            <ListItemText primary="Entrada de Documentos" />
          </ListItem>

          <ListItem>
            {user ? (
              <Box>
                {/* <div style={{ fontSize: '14px' }}>{user.name}</div> */}
                <Button onClick={handleLogout} variant="outlined" size="small">
                  Cerrar sesión
                </Button>
              </Box>
            ) : (
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log("Error al iniciar sesión con Google")}
              />
            )}
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, pt: 0, px: 3, pb: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}

