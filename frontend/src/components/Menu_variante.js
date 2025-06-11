// src/components/Menu.js
import React from "react";
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, Box, CssBaseline} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Link } from "react-router-dom";

const drawerWidth = 240;

export default function Menu() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/gestion-conceptos">
          <ListItemText primary="Gestión de Conceptos" />
        </ListItem>
        <ListItem button component={Link} to="/gestion-proveedores">
          <ListItemText primary="Gestión de Proveedores" />
        </ListItem>
        <ListItem button component={Link} to="/gestion-parametros">
          <ListItemText primary="Gestión de Parámetros" />
        </ListItem>
        <ListItem button component={Link} to="/login">
          <ListItemText primary="Salir" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar fijo */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            Sistema Cuentas por Pagar
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer: temporal en móvil, permanente en desktop */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
