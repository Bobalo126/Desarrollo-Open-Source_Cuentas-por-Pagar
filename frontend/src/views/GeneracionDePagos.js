import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Paper,
  Grid,
  Checkbox,
  Divider,
  Box,
  MenuItem,
  Select,
  InputLabel,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function GenerarPago() {
  const [fechaPago, setFechaPago] = useState("");
  const [concepto, setConcepto] = useState("");
  const [conceptosDisponibles, setConceptosDisponibles] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [totalPago, setTotalPago] = useState(0);

  const cargarDocumentosPendientes = () => {
    fetch("http://localhost:3001/pagos/pendientes")
      .then((res) => res.json())
      .then((data) => {
        const docsConSeleccion = data.map((doc) => ({
          id: doc.id,
          proveedor: doc.proveedor,
          noFactura: doc.numero_factura,
          monto: doc.monto,
          seleccionado: false,
        }));
        setDocumentos(docsConSeleccion);
      })
      .catch((error) =>
        console.error("Error al cargar documentos pendientes:", error)
      );
  };

  useEffect(() => {
    fetch("http://localhost:3001/conceptos")
      .then((res) => res.json())
      .then((data) => setConceptosDisponibles(data))
      .catch((error) => console.error("Error al cargar conceptos:", error));
  }, []);

  useEffect(() => {
    cargarDocumentosPendientes();
  }, []);

  useEffect(() => {
    const total = documentos
      .filter((doc) => doc.seleccionado)
      .reduce((sum, doc) => sum + parseFloat(doc.monto || 0), 0);
    setTotalPago(total);
  }, [documentos]);

  const toggleSeleccionado = (id) => {
    setDocumentos(
      documentos.map((doc) =>
        doc.id === id ? { ...doc, seleccionado: !doc.seleccionado } : doc
      )
    );
  };

  const procesarPago = () => {
    const documentosSeleccionados = documentos.filter((doc) => doc.seleccionado);

    if (!fechaPago || !concepto || documentosSeleccionados.length === 0) {
      alert("Por favor complete todos los campos y seleccione al menos un documento.");
      return;
    }

    const payload = {
      fecha_pago: fechaPago,
      concepto: concepto,
      documentos: documentosSeleccionados.map(({ id, proveedor, monto }) => ({
        id,
        proveedor,
        monto,
      })),
    };

    fetch("http://localhost:3001/pagos/procesar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al procesar pago");
        return res.json();
      })
      .then(() => {
        alert("Pago procesado correctamente");
        generarPDF(fechaPago, concepto, documentosSeleccionados);
        cargarDocumentosPendientes();
        setFechaPago("");
        setConcepto("");
      })
      .catch((error) => {
        console.error(error);
        alert("Error procesando pago");
      });
  };

  const generarPDF = (fecha, concepto, documentosSeleccionados) => {
    const doc = new jsPDF();
    doc.text("Resumen de Pago", 14, 15);
    doc.text(`Fecha de Pago: ${fecha}`, 14, 25);
    doc.text(`Concepto: ${concepto}`, 14, 32);

    const tabla = documentosSeleccionados.map((doc) => [
      doc.noFactura,
      doc.proveedor,
      `$${parseFloat(doc.monto).toFixed(2)}`,
    ]);

    autoTable(doc, {
      head: [["No. Factura", "Proveedor", "Monto"]],
      body: tabla,
      startY: 40,
    });

    const total = documentosSeleccionados.reduce(
      (sum, doc) => sum + parseFloat(doc.monto || 0),
      0
    );
    doc.text(`Total a Pagar: $${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);

    doc.save("pago.pdf");
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 1000, mx: "auto", mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        💳 Procesar Pago
      </Typography>

      {/* Fecha y Concepto */}
      <Box mb={3} p={2} sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <InputLabel>Fecha de Pago</InputLabel>
            <input
              type="date"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
              value={fechaPago || new Date().toISOString().split("T")[0]}
              onChange={(e) => setFechaPago(e.target.value)}
            />
          </Grid>
<Grid item xs={12} sm={6} sx={{ ml: { sm: 2, xs: 0 } }}>
  <InputLabel>Concepto</InputLabel>
  <Select
    value={concepto}
    onChange={(e) => setConcepto(e.target.value)}
    style={{
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      height: "40px",
      backgroundColor: "white",
    }}
  >
    {conceptosDisponibles.map((c) => (
      <MenuItem key={c.id} value={c.descripcion}>
        {c.descripcion}
      </MenuItem>
    ))}
  </Select>
</Grid>

        </Grid>
      </Box>

      {/* Tabla de documentos */}
      <Table>
        <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
          <TableRow>
            <TableCell />
            <TableCell>No. Factura</TableCell>
            <TableCell>Proveedor</TableCell>
            <TableCell align="right">Monto</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documentos.map((doc) => (
            <TableRow key={doc.id} hover>
              <TableCell>
                <Checkbox
                  checked={doc.seleccionado}
                  onChange={() => toggleSeleccionado(doc.id)}
                  size="small"
                />
              </TableCell>
              <TableCell>{doc.noFactura}</TableCell>
              <TableCell>{doc.proveedor}</TableCell>
              <TableCell align="right">
                ${parseFloat(doc.monto).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Divider sx={{ my: 3 }} />

      {/* Total y Botón */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        gap={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Total a Pagar: ${totalPago.toLocaleString()}
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={procesarPago}
          sx={{ py: 1.5, px: 3 }}
        >
          💾 Procesar Pago y Generar PDF
        </Button>
      </Box>
    </Paper>
  );
}
