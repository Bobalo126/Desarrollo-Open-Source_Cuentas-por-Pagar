import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Checkbox,
} from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function GenerarPago() {
  const [fechaPago, setFechaPago] = useState("");
  const [concepto, setConcepto] = useState("");
  const [documentos, setDocumentos] = useState([
    { id: Date.now(), proveedor: "", noFactura: "", monto: "", seleccionado: false },
  ]);
  const [totalPago, setTotalPago] = useState(0);

  useEffect(() => {
    const total = documentos
      .filter((doc) => doc.seleccionado)
      .reduce((sum, doc) => sum + parseFloat(doc.monto || 0), 0);
    setTotalPago(total);
  }, [documentos]);

  const agregarDocumento = () => {
    setDocumentos([
      ...documentos,
      { id: Date.now(), proveedor: "", noFactura: "", monto: "", seleccionado: false },
    ]);
  };

  const eliminarDocumento = (id) => {
    setDocumentos(documentos.filter((doc) => doc.id !== id));
  };

  const actualizarCampo = (id, campo, valor) => {
    setDocumentos(
      documentos.map((doc) => (doc.id === id ? { ...doc, [campo]: valor } : doc))
    );
  };

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

    const doc = new jsPDF();
    doc.text("Resumen de Pago", 14, 15);
    doc.text(`Fecha de Pago: ${fechaPago}`, 14, 25);
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
    <Paper sx={{ p: 4, maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Procesar Pago
      </Typography>

      <Grid container spacing={3} alignItems="center">
        {/* Fecha y Concepto */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="date"
            label="Fecha de Pago"
            InputLabelProps={{ shrink: true }}
            value={fechaPago}
            onChange={(e) => setFechaPago(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Concepto"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
          />
        </Grid>

        {/* Lista de documentos */}
        {documentos.map((doc) => (
          <React.Fragment key={doc.id}>
            <Grid item xs={12} sm={1} textAlign="center">
              <Checkbox
                checked={doc.seleccionado}
                onChange={() => toggleSeleccionado(doc.id)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="No. Factura"
                value={doc.noFactura}
                onChange={(e) => actualizarCampo(doc.id, "noFactura", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                label="Proveedor"
                value={doc.proveedor}
                onChange={(e) => actualizarCampo(doc.id, "proveedor", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                size="small"
                type="number"
                label="Monto"
                inputProps={{ min: 0, step: "0.01" }}
                value={doc.monto}
                onChange={(e) => actualizarCampo(doc.id, "monto", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2} textAlign="center">
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => eliminarDocumento(doc.id)}
              >
                Eliminar
              </Button>
            </Grid>
          </React.Fragment>
        ))}

        {/* Total, Agregar y Procesar PDF */}
<Grid item xs={12} sm={4}>
  <Typography variant="h6" fontWeight="bold" color="textPrimary">
    Total a Pagar: ${totalPago.toFixed(2)}
  </Typography>
</Grid>

        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={agregarDocumento}
            fullWidth
            sx={{ py: 1.5 }}
          >
            ➕ Agregar Documento
          </Button>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Button
            variant="contained"
            color="success"
            onClick={procesarPago}
            fullWidth
            sx={{ py: 1.5 }}
          >
            💾 Procesar Pago y Generar PDF
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
