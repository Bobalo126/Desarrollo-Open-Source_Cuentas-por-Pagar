import { Link, Outlet } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText, Box } from "@mui/material";

const drawerWidth = 240;

export default function Menu() {
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
          <ListItem button component={Link} to="/">
            <ListItemText primary="Login" />
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, pt: 0, px: 3, pb: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
