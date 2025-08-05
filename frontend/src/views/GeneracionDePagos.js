import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  Checkbox,
  Divider,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function GenerarPago() {
  const [fechaPago, setFechaPago] = useState("");
  const [concepto, setConcepto] = useState("");
  const [conceptosDisponibles, setConceptosDisponibles] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [totalPago, setTotalPago] = useState(0);

  // Cargar documentos pendientes al iniciar
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

  // Cargar conceptos disponibles
  useEffect(() => {
    fetch("http://localhost:3001/conceptos")
      .then((res) => res.json())
      .then((data) => setConceptosDisponibles(data))
      .catch((error) => console.error("Error al cargar conceptos:", error));
  }, []);

  // Cargar documentos pendientes al montar componente y después de cada pago procesado
  useEffect(() => {
    cargarDocumentosPendientes();
  }, []);

  // Recalcular total al cambiar selección o documentos
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

    // Preparar datos para enviar al backend
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
        // Generar PDF
        generarPDF(fechaPago, concepto, documentosSeleccionados);
        // Recargar documentos pendientes
        cargarDocumentosPendientes();
        // Reset campos
        setFechaPago("");
        setConcepto("");
      })
      .catch((error) => {
        console.error(error);
        alert("Error procesando pago");
      });
  };

  // Función para generar PDF
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
    <Paper sx={{ p: 4, maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Procesar Pago
      </Typography>

{/* Fecha y Concepto */}
<Box mb={3} p={2} sx={{ backgroundColor: "#f9f9f9", borderRadius: 2 }}>
  <Grid container spacing={2} alignItems="center">
    <Grid item xs={12} sm={6}>
      <TextField
        fullWidth
        type="date"
        label="Fecha de Pago"
        InputLabelProps={{ shrink: true }}
        value={fechaPago || new Date().toISOString().split("T")[0]} // Valor por defecto hoy
        onChange={(e) => setFechaPago(e.target.value)}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <FormControl fullWidth>
        <InputLabel id="label-concepto">Concepto</InputLabel>
        <Select
          labelId="label-concepto"
          label="Concepto"
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
        >
          {conceptosDisponibles.map((c) => (
            <MenuItem key={c.id} value={c.descripcion}>
              {c.descripcion}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  </Grid>
</Box>

      {/* Lista de Documentos Pendientes */}
      {documentos.map((doc) => (
        <Box key={doc.id} display="flex" alignItems="center" gap={2} mb={2}>
          <Checkbox
            checked={doc.seleccionado}
            onChange={() => toggleSeleccionado(doc.id)}
            size="small"
          />
          <TextField
            label="No. Factura"
            size="small"
            value={doc.noFactura}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Proveedor"
            size="small"
            value={doc.proveedor}
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Monto"
            size="small"
            type="number"
            value={doc.monto}
            InputProps={{ readOnly: true }}
          />
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* Total y Botones */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" fontWeight="bold">
            Total a Pagar: ${totalPago.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
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
