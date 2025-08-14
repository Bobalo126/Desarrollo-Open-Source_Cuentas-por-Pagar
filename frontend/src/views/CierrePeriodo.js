import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Paper, Box, Grid, Typography, Button, Select, MenuItem, InputLabel,
  FormControl, Table, TableHead, TableRow, TableCell, TableBody, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, TextField
} from '@mui/material';

const MESES = [
  { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' }, { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' }, { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' }, { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' }, { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
];

function toPeriodo(anio, mes) {
  const mm = String(mes).padStart(2, '0');
  return `${anio}-${mm}-01`;
}

function parsePeriodo(periodoStr) {
  // Espera 'YYYY-MM-01'
  const y = parseInt(periodoStr.slice(0, 4), 10);
  const m = parseInt(periodoStr.slice(5, 7), 10);
  return { anio: y, mes: m };
}

function money(n) {
  const val = Number(n || 0);
  return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function CierrePeriodo() {
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [cerrando, setCerrando] = useState(false);

  const [periodoActual, setPeriodoActual] = useState(null); // 'YYYY-MM-01'
  const [anioSel, setAnioSel] = useState(new Date().getFullYear());
  const [mesSel, setMesSel] = useState(new Date().getMonth() + 1);

  const [detalle, setDetalle] = useState([]);   // [{id, proveedor, fecha_pago, monto, concepto}]
  const [resumen, setResumen] = useState([]);   // [{proveedor, total}]
  const [buscandoPagos, setBuscandoPagos] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const totalMes = useMemo(() => resumen.reduce((s, r) => s + Number(r.total || 0), 0), [resumen]);

  // Cargar periodo de cierre guardado y AUTO-cargar pagos del mes
  useEffect(() => {
    (async () => {
      try {
        setCargando(true);
        const { data } = await axios.get('http://localhost:3001/cierre/periodo');
        if (data?.periodo) {
          setPeriodoActual(data.periodo);
          const { anio, mes } = parsePeriodo(data.periodo);
          setAnioSel(anio);
          setMesSel(mes);
          // AUTOCARGA de pagos del mes del período guardado
          await cargarPagos(anio, mes);
        } else if (data?.id && data?.periodo) {
          setPeriodoActual(data.periodo);
          const { anio, mes } = parsePeriodo(data.periodo);
          setAnioSel(anio);
          setMesSel(mes);
          // AUTOCARGA de pagos
          await cargarPagos(anio, mes);
        } else {
          // Si no hay periodo en BD, usa mes/año actuales del sistema
          await cargarPagos(anioSel, mesSel);
        }
      } catch (e) {
        console.error('Error cargando período:', e);
      } finally {
        setCargando(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function guardarPeriodo() {
    try {
      setGuardando(true);
      const periodo = toPeriodo(anioSel, mesSel);
      await axios.put('http://localhost:3001/cierre/periodo', { periodo });
      setPeriodoActual(periodo);
      // Opcional: volver a cargar pagos del nuevo período
      await cargarPagos(anioSel, mesSel);
    } catch (e) {
      console.error('Error guardando periodo:', e);
      alert('No se pudo guardar el período.');
    } finally {
      setGuardando(false);
    }
  }

  // ACEPTA anio/mes opcionales para usar inmediatamente tras leer el período
  async function cargarPagos(anioParam, mesParam) {
    try {
      setBuscandoPagos(true);
      const anio = anioParam ?? anioSel;
      const mes = mesParam ?? mesSel;
      const params = new URLSearchParams({ anio, mes }).toString();
      const { data } = await axios.get(`http://localhost:3001/cierre/pagos-mes?${params}`);
      setDetalle(data?.detalle || []);
      setResumen(data?.resumen || []);
    } catch (e) {
      console.error('Error cargando pagos del mes:', e);
      alert('No se pudieron cargar los pagos del mes.');
    } finally {
      setBuscandoPagos(false);
    }
  }

  async function ejecutarCierre() {
    try {
      setCerrando(true);
      const { data } = await axios.post('http://localhost:3001/cierre/ejecutar', {
        anio: anioSel,
        mes: mesSel,
      });
      // Actualizar período al devuelto por el backend
      if (data?.periodo) {
        setPeriodoActual(data.periodo);
        const { anio, mes } = parsePeriodo(data.periodo);
        setAnioSel(anio);
        setMesSel(mes);
        // Cargar pagos del nuevo período automáticamente
        await cargarPagos(anio, mes);
      } else if (data?.nuevo_anio && data?.nuevo_mes) {
        const periodoNuevo = toPeriodo(data.nuevo_anio, data.nuevo_mes);
        setPeriodoActual(periodoNuevo);
        setAnioSel(data.nuevo_anio);
        setMesSel(data.nuevo_mes);
        await cargarPagos(data.nuevo_anio, data.nuevo_mes);
      } else {
        // Si no llegó info del nuevo período, limpia
        setDetalle([]);
        setResumen([]);
      }
      alert('Cierre ejecutado correctamente.');
    } catch (e) {
      console.error('Error ejecutando cierre:', e);
      alert('No se pudo ejecutar el cierre.');
    } finally {
      setCerrando(false);
      setConfirmOpen(false);
    }
  }

  return (
    <Paper sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Proceso de Cierre</Typography>

      <Box mb={2}>
        <Typography variant="body1" color="text.secondary">
          Periodo actual: {cargando ? '...' : (periodoActual ? periodoActual.slice(0, 7) : 'no definido')}
        </Typography>
      </Box>

      <Box mb={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="mes-label">Mes</InputLabel>
              <Select
                labelId="mes-label"
                label="Mes"
                value={mesSel}
                onChange={(e) => setMesSel(Number(e.target.value))}
              >
                {MESES.map(m => (
                  <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              type="number"
              label="Año"
              fullWidth
              value={anioSel}
              onChange={(e) => setAnioSel(Number(e.target.value))}
            />
          </Grid>

          <Grid item xs={12} sm="auto">
            <Button
              variant="outlined"
              onClick={guardarPeriodo}
              disabled={guardando}
            >
              {guardando ? <CircularProgress size={22} /> : 'Guardar período'}
            </Button>
          </Grid>

          <Grid item xs={12} sm="auto">
            <Button
              variant="contained"
              onClick={() => cargarPagos()}
              disabled={buscandoPagos}
            >
              {buscandoPagos ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Cargar pagos del mes'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>Resumen por Proveedor</Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Proveedor</TableCell>
            <TableCell align="right">Total Pagado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {resumen.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} align="center" sx={{ color: 'text.secondary' }}>
                {buscandoPagos ? 'Cargando...' : 'Sin datos'}
              </TableCell>
            </TableRow>
          )}
          {resumen.map((r, idx) => (
            <TableRow key={idx}>
              <TableCell>{r.proveedor}</TableCell>
              <TableCell align="right">${money(r.total)}</TableCell>
            </TableRow>
          ))}
          {resumen.length > 0 && (
            <TableRow>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>TOTAL</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                ${money(totalMes)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Detalle de Pagos</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>No. Solicitud</TableCell>
              <TableCell>Proveedor</TableCell>
              <TableCell>Fecha de Pago</TableCell>
              <TableCell>Concepto</TableCell>
              <TableCell align="right">Monto</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detalle.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary' }}>
                  {buscandoPagos ? 'Cargando...' : 'Sin datos'}
                </TableCell>
              </TableRow>
            )}
            {detalle.map((d) => (
              <TableRow key={d.id}>
                <TableCell>{d.id}</TableCell>
                <TableCell>{d.proveedor}</TableCell>
                <TableCell>{(d.fecha_pago || '').split('T')[0]}</TableCell>
                <TableCell>{d.concepto}</TableCell>
                <TableCell align="right">${money(d.monto)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
        <Button
          variant="contained"
          color="error"
          disabled={resumen.length === 0 || cerrando}
          onClick={() => setConfirmOpen(true)}
        >
          {cerrando ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Cerrar período'}
        </Button>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirmar cierre</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2">
            Se restará del balance de los proveedores el total pagado en {MESES.find(m => m.value === mesSel)?.label} {anioSel}.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Total del mes: <b>${money(totalMes)}</b>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button
            variant="contained"
            color="error"
            onClick={ejecutarCierre}
            disabled={cerrando}
          >
            {cerrando ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
