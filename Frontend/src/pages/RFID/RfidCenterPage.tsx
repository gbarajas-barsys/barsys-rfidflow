import { useState } from "react";
import { useEffect } from "react";
import { api } from "../../api/apiClient";

import {
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Chip,
  Checkbox,
  Divider,
  Select,
  MenuItem,
  TextField,
  Box,
  Alert,
} from "@mui/material";

export default function RfidCenterPage() {
  const [assets, setAssets] =
  useState<any[]>([]);

  const [products, setProducts] =
  useState<any[]>([]);
  
  const [tab, setTab] =
    useState(0);
  
  const [
    strategyOpen,
    setStrategyOpen,
    ] = useState(false);

    const [
    selectedProduct,
    setSelectedProduct,
    ] = useState<any>(null);

    const [
    strategy,
    setStrategy,
    ] = useState(
    "SIN_RFID"
    );
    
    const [
      barcodeEnabled,
      setBarcodeEnabled,
    ] = useState(true);

    const [
      printDialogOpen,
      setPrintDialogOpen,
    ] = useState(false);

    const [
      selectedAsset,
      setSelectedAsset,
    ] = useState<any>(null);

    const [
      generatedEpc,
      setGeneratedEpc,
    ] = useState("");

    const [
      printStatus,
      setPrintStatus,
    ] = useState("Pendiente");

    const [
      assigned,
      setAssigned,
    ] = useState(false);

    const [
      labelTemplate,
      setLabelTemplate,
    ] = useState(
      "ESTANDAR"
    );

    const [
      printer,
      setPrinter,
    ] = useState(
      ""
    );

    const [
      encoding,
      setEncoding,
    ] = useState(
      "EPC_GEN2"
    );

    const currentUser =
    JSON.parse(
      localStorage.getItem(
        "currentUser"
      ) ?? "{}"
    );

    const [printJobs, setPrintJobs] =
      useState<any[]>([]);

    const [
      strategies,
      setStrategies,
    ] = useState<
      Record<
        string,
        {
          strategy: string;
          barcodeEnabled: boolean;
        }
      >
    >({});

  const loadProducts =
    async () => {

        try {

        const response =
            await api.get(
            "/v2/Items?page=1&pageSize=100"
            );

        setProducts(
            response.data
        );

        } catch (error) {

        console.error(error);

        }
    };

  const loadAssets =
    async () => {

      try {

        const response =
          await api.get(
            "/v2/Assets/all"
          );

        setAssets(
          response.data
        );

      } catch (error) {

        console.error(error);

      }
  };

  const loadPrintJobs =
  async () => {

    try {

      const response =
        await api.get(
          "/v2/rfid/print-jobs"
        );

      setPrintJobs(
        response.data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
      );

    } catch (error) {

      console.error(error);

    }

  };

      useEffect(() => {

        loadProducts();
        loadPrintJobs();

        loadAssets();

        const storedStrategies =
          JSON.parse(
            localStorage.getItem(
              "rfid-strategies"
            ) ?? "{}"
          );

        setStrategies(
          storedStrategies
        );

        }, []);

    const assignEpcToAsset = async () => {

      if (
        !selectedAsset ||
        !generatedEpc
      ) {
        return;
      }

      try {

        await api.post(
          `/v2/Assets/${selectedAsset.id}/assign-tag`,
          {
            epc: generatedEpc,
            tid: null,

            encodingType:
              encoding,

            overwriteExisting: false
          }
        );

        setAssigned(true);

        setPrintStatus(
          "RFID Asignado"
        );

        await loadAssets();

      } catch (error) {

        console.error(error);

      }
    };


  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Centro RFID
      </Typography>

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
        >
        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
              Activos Pendientes
            </Typography>

            <Typography variant="h3">
            {
              assets.filter(
                asset =>
                  !asset.epc
              ).length
            }
            </Typography>
            </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
                Productos RFID
            </Typography>

            <Typography variant="h3">
                {
                  Object.values(
                    strategies
                  ).filter(
                    (config: any) =>
                      config.strategy !==
                      "SIN_RFID"
                  ).length
                }
            </Typography>
            </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>

            <Typography variant="h6">
              Código de Barras
            </Typography>

            <Typography variant="h3">
              {
                Object.values(
                  strategies
                ).filter(
                  (config: any) =>
                    config.barcodeEnabled
                ).length
              }
            </Typography>

          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
                Impresiones Hoy
            </Typography>

            <Typography variant="h3">
              {printJobs.length}
            </Typography>
            </Paper>
        </Grid>
        </Grid>

      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, value) =>
            setTab(value)
          }
        >
          <Tab label="Productos" />

          <Tab label="Activos" />

          <Tab label="Trabajos de Impresión" />
        </Tabs>

        <Typography
        color="text.secondary"
        sx={{ mb: 2 }}
        >
        Configure estrategias RFID para
        activos y productos.
        </Typography>
      </Paper>

      {tab === 0 && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  SKU
                </TableCell>

                <TableCell>
                  Nombre
                </TableCell>

                <TableCell>
                  Estrategia
                </TableCell>

                <TableCell>
                  Código de Barras
                </TableCell>

                <TableCell>
                  Acción
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

            {products.map(
                (product) => (

                <TableRow
                    key={product.id}
                >

                    <TableCell>
                    {product.sku}
                    </TableCell>

                    <TableCell>
                    {product.name}
                    </TableCell>

                    <TableCell>

                      {
                        strategies[
                          product.sku
                        ]?.strategy === "RFID_INDIVIDUAL"
                          ? (
                            <Chip
                              size="small"
                              color="success"
                              label="RFID Individual"
                            />
                          )

                          : strategies[
                              product.sku
                            ]?.strategy === "RFID_MASTER"
                          ? (
                            <Chip
                              size="small"
                              color="info"
                              label="RFID Master"
                            />
                          )

                          : (
                            <Chip
                              size="small"
                              color="default"
                              label="Sin RFID"
                            />
                          )
                      }

                    </TableCell>

                    <TableCell>

                      {
                        strategies[
                          product.sku
                        ]?.barcodeEnabled

                          ? (
                            <Chip
                              size="small"
                              color="primary"
                              label="Habilitado"
                            />
                          )

                          : (
                            <Chip
                              size="small"
                              color="default"
                              label="Deshabilitado"
                            />
                          )
                      }

                    </TableCell>

                    <TableCell>

                    <Button
                    variant="outlined"
                    onClick={() => {

                    setSelectedProduct(product);

                    setStrategy(
                      strategies[
                        product.sku
                      ]?.strategy ?? "SIN_RFID"
                    );

                    setStrategyOpen(true);

                    }}
                    >
                    Configurar RFID
                    </Button>

                    </TableCell>

                </TableRow>

                )
            )}

            </TableBody>
          </Table>
        </Paper>
      )}

      {tab === 1 && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Activo
                </TableCell>

                <TableCell>
                  Nombre
                </TableCell>

                <TableCell>
                  Estado RFID
                </TableCell>

                <TableCell>
                  Acción
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

            {assets.map(
                (asset) => (

                <TableRow
                    key={asset.id}
                >

                    <TableCell>
                    {asset.assetNumber}
                    </TableCell>

                    <TableCell>
                    {asset.name}
                    </TableCell>

                    <TableCell>
                    {asset.epc
                        ? "Asignado"
                        : "Pendiente"}
                    </TableCell>

                    <TableCell>

                    <Button
                      variant="outlined"
                      onClick={() => {

                        setSelectedAsset(asset);

                        setGeneratedEpc("");

                        setAssigned(false);

                        setPrintStatus(
                          asset.epc
                            ? "RFID Asignado"
                            : "Pendiente"
                        );

                        setPrintDialogOpen(true);

                      }}
                    >
                      Preparar Impresión
                    </Button>

                    </TableCell>

                </TableRow>

                )
            )}

            </TableBody>
          </Table>
        </Paper>
      )}

      {tab === 2 && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Usuario
                </TableCell>

                <TableCell>
                  EPC
                </TableCell>

                <TableCell>
                  Codificación
                </TableCell>

                <TableCell>
                  Impresora
                </TableCell>

                <TableCell>
                  Estado
                </TableCell>

                <TableCell>
                  Fecha
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {printJobs.map(job => (

                <TableRow key={job.id}>

                  <TableCell>
                    {job.requestedByName}
                  </TableCell>

                  <TableCell>
                    {job.epc}
                  </TableCell>

                  <TableCell>
                    {job.encodingType}
                  </TableCell>

                  <TableCell>
                    {job.printerName}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={job.status}
                      color={
                        job.status === "Completed"
                          ? "success"
                          : job.status === "Failed"
                          ? "error"
                          : "warning"
                      }
                      size="small"
                    />
                  </TableCell>

                  <TableCell>
                    {new Date(
                      job.createdAt
                    ).toLocaleString()}
                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>
        </Paper>
      )}

      <Dialog
        open={strategyOpen}
        onClose={() =>
            setStrategyOpen(false)
        }
        maxWidth="sm"
        fullWidth
        >
        <DialogTitle>
            Estrategia RFID
        </DialogTitle>

        <DialogContent>

            <Typography
            sx={{ mb: 2 }}
            >
            Producto:
            {" "}
            {
                selectedProduct?.name
            }
            </Typography>

            <Typography
            color="text.secondary"
            sx={{ mb: 2 }}
            >
            Seleccione la estrategia de
            identificación para este
            producto.
            </Typography>

            <FormControl>
            <RadioGroup
                value={strategy}
                onChange={(e) =>
                setStrategy(
                    e.target.value
                )
                }
            >

                <FormControlLabel
                value="SIN_RFID"
                control={<Radio />}
                label="Sin RFID"
                />

                <FormControlLabel
                value="INDIVIDUAL"
                control={<Radio />}
                label="RFID Individual"
                />

                <FormControlLabel
                value="MASTER"
                control={<Radio />}
                label="RFID Master (Lote)"
                />

            </RadioGroup>

            <FormControlLabel
              control={
                <Checkbox
                  checked={barcodeEnabled}
                  onChange={(e) =>
                    setBarcodeEnabled(
                      e.target.checked
                    )
                  }
                />
              }
              label="Código de barras habilitado"
            />

            <Typography
            color="text.secondary"
            sx={{ mt: 2 }}
            >
            {strategy === "SIN_RFID" &&
                "El producto se identificará mediante código de barras o captura manual."}

            {strategy === "INDIVIDUAL" &&
                "Cada unidad tendrá su propio EPC RFID."}

            {strategy === "MASTER" &&
                "Un EPC RFID representará un lote o grupo de unidades."}
            </Typography>

            </FormControl>

        </DialogContent>

        <DialogActions>

            <Button
            onClick={() =>
                setStrategyOpen(false)
            }
            >
            Cancelar
            </Button>

            <Button
            variant="contained"
            onClick={() => {

                const updatedStrategies = {

                  ...strategies,

                  [selectedProduct.sku]: {

                    strategy,

                    barcodeEnabled,

                  },

                };

                setStrategies(
                  updatedStrategies
                );

                localStorage.setItem(
                  "rfid-strategies",
                  JSON.stringify(
                    updatedStrategies
                  )
                );

                setStrategyOpen(
                false
                );

            }}
            >
            Guardar
            </Button>

        </DialogActions>
        </Dialog>
        <Dialog
          open={printDialogOpen}
          onClose={() =>
            setPrintDialogOpen(false)
          }
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Preparar Etiqueta RFID
          </DialogTitle>

          <DialogContent>

            <Typography sx={{ mb: 1 }}>
              <strong>Activo:</strong>{" "}
              {selectedAsset?.assetNumber}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <strong>Nombre:</strong>{" "}
              {selectedAsset?.name}
            </Typography>

            <Typography sx={{ mb: 1 }}>
              <strong>Estado RFID:</strong>{" "}
              {
                selectedAsset?.epc
                  ? "Asignado"
                  : "Pendiente"
              }
            </Typography>

            <Typography sx={{ mb: 2 }}>
              <strong>EPC:</strong>{" "}
              {
                selectedAsset?.epc ??
                "No asignado"
              }
            </Typography>

            {generatedEpc && (

              <Typography
                sx={{ mt: 2 }}
              >
                <strong>
                  EPC Generado:
                </strong>{" "}
                {generatedEpc}
              </Typography>

            )}

            {assigned && (

              <Typography
                color="success.main"
                sx={{ mt: 2 }}
              >
                EPC asociado al activo.
              </Typography>

            )}

            <Typography
              sx={{ mt: 1 }}
            >
              <strong>
                Estado:
              </strong>{" "}
              {printStatus}
            </Typography>

            {
              selectedAsset?.epc && (

                <Alert
                  severity="info"
                  sx={{ mb: 2 }}
                >
                  Este activo ya tiene un EPC
                  asignado.
                </Alert>

              )
            }

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="h6"
              gutterBottom
            >
              Configuración de Impresión
            </Typography>

            <TextField
              select
              fullWidth
              margin="dense"
              label="Plantilla"
              value={labelTemplate}
              onChange={(e) =>
                setLabelTemplate(
                  e.target.value
                )
              }
            >
              <MenuItem value="ESTANDAR">
                Estándar RFID
              </MenuItem>

              <MenuItem value="PATRIMONIAL">
                Patrimonial
              </MenuItem>

              <MenuItem value="INDUSTRIAL">
                Industrial
              </MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              margin="dense"
              label="Impresora"
              value={printer}
              onChange={(e) =>
                setPrinter(
                  e.target.value
                )
              }
            >
              <MenuItem value="">
                No seleccionada
              </MenuItem>

              <MenuItem value="ZEBRA-01">
                Zebra-01
              </MenuItem>

              <MenuItem value="ZEBRA-02">
                Zebra-02
              </MenuItem>
            </TextField>

            <TextField
              select
              fullWidth
              margin="dense"
              label="Codificación"
              value={encoding}
              onChange={(e) =>
                setEncoding(
                  e.target.value
                )
              }
            >
              <MenuItem value="EPC_GEN2">
                EPC Gen2
              </MenuItem>

              <MenuItem value="SGTIN">
                SGTIN
              </MenuItem>

              <MenuItem value="GIAI">
                GIAI
              </MenuItem>
            </TextField>

            <Divider sx={{ my: 2 }} />

            <Typography
              variant="h6"
              gutterBottom
            >
              Resumen del Trabajo
            </Typography>

            <Typography>
              Plantilla: {labelTemplate}
            </Typography>

            <Typography>
              Codificación: {encoding}
            </Typography>

            <Typography>
              Impresora: {
                printer || "No seleccionada"
              }
            </Typography>

            <Typography>
              EPC: {
                generatedEpc ||
                selectedAsset?.epc ||
                "No generado"
              }

            </Typography>

            <Typography
              color="text.secondary"
            >
              Este activo está listo
              para generar y asociar
              una etiqueta RFID.
            </Typography>

          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: "space-between",
              px: 3,
              pb: 2,
            }}
          >
            <Button
              onClick={() =>
                setPrintDialogOpen(false)
              }
            >
              Cancelar
            </Button>

            <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Button
                variant="contained"
                disabled={
                  !!selectedAsset?.epc
                }
                onClick={async () => {

                  try {

                    const response =
                      await api.post(
                        "/v2/rfid/epc/generate",
                        {
                          encoding
                        }
                      );

                    setGeneratedEpc(
                      response.data.epc
                    );

                    setPrintStatus(
                      "Listo para impresión"
                    );

                  } catch (error) {

                    console.error(error);

                  }

                }}
              >
                Generar EPC
              </Button>

              <Button
                variant="contained"
                color="success"
                disabled={!generatedEpc}
                onClick={
                  assignEpcToAsset
                }
              >
                Asignar EPC
              </Button>

              <Button
                variant="contained"
                color="secondary"
                disabled={
                  !generatedEpc ||
                  !printer
                }
                onClick={async () => {

                  try {

                    await api.post(
                      "/v2/rfid/print-jobs",
                      {
                        assetId:
                          selectedAsset.id,

                        epc:
                          generatedEpc,

                        encodingType:
                          encoding,

                        labelTemplate:
                          labelTemplate,

                        printerName:
                          printer,

                        requestedByName:
                          "Barsys Administrator"
                      }
                    );

                    setPrintStatus(
                      "Trabajo enviado"
                    );

                    await loadPrintJobs();

                  } catch (error) {

                    console.error(error);

                  }

                }}
              >
                Imprimir
              </Button>
            </Box>
          </DialogActions>

        </Dialog>
    </>
  );
}