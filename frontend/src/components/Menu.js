import React from "react";
import { Link } from "react-router-dom";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";

export default function Menu() {
  return (
    <Drawer variant="permanent" anchor="left">
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
          <ListItemText primary="Login" />
        </ListItem>
      </List>
    </Drawer>
  );
}