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
  } from "@mui/material";

export default function RfidCenterPage() {
  const [assets, setAssets] =
  useState<any[]>([]);

  const [products, setProducts] =
  useState<any[]>([]);
  
  const [tab, setTab] =
    useState(2);
  
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

    const [reprintDialogOpen, setReprintDialogOpen] =
      useState(false);

    const [detailsDialogOpen,
      setDetailsDialogOpen] =
      useState(false);

    const [selectedPrintJob, setSelectedPrintJob] =
      useState<any>(null);

    const [reprintReason, setReprintReason] =
      useState("Etiqueta dañada");

    const [reprintDescription,
      setReprintDescription] =
      useState("");

    const [reprintPrinter, setReprintPrinter] =
      useState("ZEBRA-01");

    const [
      newPrintDialogOpen,
      setNewPrintDialogOpen
    ] = useState(false);

    const [
      printTargetType,
      setPrintTargetType
    ] = useState("ASSET");

    const [
      printSearch,
      setPrintSearch
    ] = useState("");

    const [
      selectedItems,
      setSelectedItems
    ] = useState<any[]>([]);

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

    const pendingJobs =
      printJobs.filter(
        job => job.status === "Pending"
      ).length;

    const completedJobs =
      printJobs.filter(
        job => job.status === "Completed"
      ).length;

    const failedJobs =
      printJobs.filter(
        job => job.status === "Failed"
      ).length;

    const reprintJobs =
      printJobs.filter(
        job => job.isReprint
      ).length;
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >

        <Typography
          variant="h4"
        >
          Centro RFID
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => {

            setSelectedItems([]);
            setPrintSearch("");
            setPrintTargetType("ASSET");

            setNewPrintDialogOpen(true);

          }}
        >
          Nueva Impresión
        </Button>

      </Box>

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
        >
        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
              Pendientes
            </Typography>

            <Typography variant="h3">
              {pendingJobs}
            </Typography>
            </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
                Completadas
            </Typography>

            <Typography variant="h3">
              {completedJobs}
            </Typography>
            </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>

            <Typography variant="h6">
              Fallidas
            </Typography>

            <Typography variant="h3">
              {failedJobs}
            </Typography>

          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
            <Typography variant="h6">
                Reimpresiones
            </Typography>

            <Typography variant="h3">
              {reprintJobs}
            </Typography>
            </Paper>
        </Grid>
        </Grid>

      <Paper sx={{ mb: 2 }}>
        
        <Tabs
          centered
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
          sx={{
            mb: 2,
            mt: 1,
            textAlign: "center"
          }}
        >
          Administre y monitoree los trabajos
          de impresión RFID.
        </Typography>
      </Paper>

      {tab === 0 && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Estrategia</TableCell>
                <TableCell>Código de Barras</TableCell>
                <TableCell>Acción</TableCell>
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
                    <Chip
                      size="small"
                      color={
                        asset.epc
                          ? "success"
                          : "error"
                      }
                      label={
                        asset.epc
                          ? "RFID Asignado"
                          : "Sin RFID"
                      }
                    />
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
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar activo, usuario o impresora..."
            sx={{ mb: 2 }}
          />
          
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell>Impresora</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {printJobs.map(job => (

                <TableRow key={job.id}>

                  <TableCell>
                    {new Date(
                      job.createdAt
                    ).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    {job.requestedByName}
                  </TableCell>

                  <TableCell>
                    {job.assetName ?? job.epc}
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

                          : job.status === "Printing"
                          ? "info"

                          : "warning"
                      }
                      size="small"
                    />

                  </TableCell>

                  <TableCell>

                    <Chip
                      label={
                        job.isReprint
                          ? "Reimpresión"
                          : "Original"
                      }
                      color={
                        job.isReprint
                          ? "warning"
                          : "success"
                      }
                      size="small"
                    />

                  </TableCell>

                  <TableCell>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap"
                      }}
                    >

                      <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        onClick={() => {

                          setSelectedPrintJob(job);

                          setDetailsDialogOpen(true);

                        }}
                      >
                        Detalles
                      </Button>

                      <Button
                        size="small"
                        color="warning"
                        variant="outlined"
                        onClick={() => {

                          setSelectedPrintJob(job);

                          setReprintPrinter(
                            job.printerName
                          );

                          setReprintDialogOpen(true);

                        }}
                      >
                        Reimprimir
                      </Button>

                    </Box>

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
        open={reprintDialogOpen}
        onClose={() =>
          setReprintDialogOpen(false)
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Reimpresión RFID
        </DialogTitle>

        <DialogContent>

          <Typography sx={{ mb: 2 }}>
            EPC:
            {" "}
            {selectedPrintJob?.epc}
          </Typography>

          <TextField
            select
            fullWidth
            margin="dense"
            label="Impresora"
            value={reprintPrinter}
            onChange={(e) =>
              setReprintPrinter(
                e.target.value
              )
            }
          >
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
            label="Motivo"
            value={reprintReason}
            onChange={(e) =>
              setReprintReason(
                e.target.value
              )
            }
          >
            <MenuItem value="Etiqueta dañada">
              Etiqueta dañada
            </MenuItem>

            <MenuItem value="Error de impresión">
              Error de impresión
            </MenuItem>

            <MenuItem value="Cambio de ubicación">
              Cambio de ubicación
            </MenuItem>

            <MenuItem value="Reposición de activo">
              Reposición de activo
            </MenuItem>

            <MenuItem value="Otro">
              Otro
            </MenuItem>

          </TextField>

          {
            reprintReason === "Otro" && (

              <TextField
                fullWidth
                margin="dense"
                label="Describa el motivo"
                value={reprintDescription}
                onChange={(e) =>
                  setReprintDescription(
                    e.target.value
                  )
                }
              />

            )
          }

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setReprintDialogOpen(false)
            }
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            color="warning"
            disabled={
              reprintReason === "Otro" &&
              !reprintDescription.trim()
            }
            onClick={async () => {

              try {

                await api.post(
                  "/v2/rfid/print-jobs",
                  {
                    assetId:
                      selectedPrintJob.assetId,

                    epc:
                      selectedPrintJob.epc,

                    encodingType:
                      selectedPrintJob.encodingType,

                    labelTemplate:
                      selectedPrintJob.labelTemplate,

                    printerName:
                      reprintPrinter,

                    requestedByName:
                      currentUser?.displayName ??
                      "Barsys Administrator",

                    isReprint:
                      true,

                    originalPrintJobId:
                      selectedPrintJob.id,

                    reprintReason:
                      reprintReason === "Otro"
                        ? reprintDescription
                        : reprintReason
                  }
                );

                await loadPrintJobs();

                setReprintDialogOpen(false);

              } catch (error) {

                console.error(error);

              }

            }}
          >
            Reimprimir
          </Button>

        </DialogActions>

      </Dialog>
      <Dialog
        open={detailsDialogOpen}
        onClose={() =>
          setDetailsDialogOpen(false)
        }
        maxWidth="md"
        fullWidth
      >

        <DialogTitle>
          Detalles de Impresión RFID
        </DialogTitle>

        <DialogContent>

          <Grid container spacing={2}>

            <Grid item xs={12} md={6}>
              <Typography>
                <strong>EPC:</strong>{" "}
                {selectedPrintJob?.epc}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Codificación:</strong>{" "}
                {selectedPrintJob?.encodingType}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Impresora:</strong>{" "}
                {selectedPrintJob?.printerName}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Plantilla:</strong>{" "}
                {selectedPrintJob?.labelTemplate}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Estado:</strong>{" "}
                {selectedPrintJob?.status}
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Tipo:</strong>{" "}
                {
                  selectedPrintJob?.isReprint
                    ? "Reimpresión"
                    : "Original"
                }
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography>
                <strong>Motivo:</strong>{" "}
                {
                  selectedPrintJob?.reprintReason
                  ?? "-"
                }
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Intentos:</strong>{" "}
                {
                  selectedPrintJob?.attemptCount
                  ?? 0
                }
              </Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography>
                <strong>Error:</strong>{" "}
                {
                  selectedPrintJob?.failureReason
                  ?? "-"
                }
              </Typography>

            </Grid>

          </Grid>

        <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    justifyContent: "flex-end"
                  }}
                >

                  <Button
                    variant="contained"
                    color="success"
                    onClick={async () => {

                      await api.post(
                        `/v2/rfid/print-jobs/${selectedPrintJob.id}/complete`
                      );

                      await loadPrintJobs();

                      setDetailsDialogOpen(false);

                    }}
                  >
                    Marcar Completado
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    onClick={async () => {

                      await api.post(
                        `/v2/rfid/print-jobs/${selectedPrintJob.id}/fail`
                      );

                      await loadPrintJobs();

                      setDetailsDialogOpen(false);

                    }}
                  >
                    Marcar Fallido
                  </Button>

                </Box>


        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setDetailsDialogOpen(false)
            }
          >
            Cerrar
          </Button>

        </DialogActions>

      </Dialog>

      <Dialog
        open={newPrintDialogOpen}
        onClose={() =>
          setNewPrintDialogOpen(false)
        }
        maxWidth="md"
        fullWidth
      >

        <DialogTitle>
          Nueva Impresión RFID
        </DialogTitle>

        <DialogContent>

          <TextField
            select
            fullWidth
            margin="dense"
            label="Tipo"
            value={printTargetType}
            onChange={(e) =>
              setPrintTargetType(
                e.target.value
              )
            }
          >

            <MenuItem value="ASSET">
              Activo
            </MenuItem>

            <MenuItem value="PRODUCT">
              Producto
            </MenuItem>

          </TextField>

          <TextField
            fullWidth
            margin="dense"
            label={
              printTargetType === "ASSET"
                ? "Buscar activo"
                : "Buscar producto"
            }
            value={printSearch}
            onChange={(e) =>
              setPrintSearch(
                e.target.value
              )
            }
          />

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mt: 2 }}>

            {(printTargetType === "ASSET"
              ? assets
              : products)
              .filter(item => {

                const value =
                  printTargetType === "ASSET"
                    ? `${item.assetNumber} ${item.name}`
                    : `${item.sku} ${item.name}`;

                return value
                  .toLowerCase()
                  .includes(
                    printSearch.toLowerCase()
                  );

              })
              .slice(0, 10)
              .map(item => (

                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    py: 1
                  }}
                >

                  <Typography>

                    {
                      printTargetType === "ASSET"
                        ? item.name
                        : item.name
                    }

                  </Typography>

                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {

                      setSelectedItems(prev => {

                        if (
                          prev.some(
                            x => x.id === item.id
                          )
                        ) {
                          return prev;
                        }

                        return [
                          ...prev,
                          item
                        ];

                      });

                    }}
                  >
                    Agregar
                  </Button>

                </Box>

              ))}

          </Box>

          <Divider sx={{ my: 2 }} />

            <Typography
              variant="h6"
            >
              Seleccionados
            </Typography>

            {selectedItems.map(item => (

              <Chip
                key={item.id}
                label={item.name}
                onDelete={() => {

                  setSelectedItems(
                    prev =>
                      prev.filter(
                        x => x.id !== item.id
                      )
                  );

                }}
                sx={{
                  mr: 1,
                  mb: 1
                }}
              />

            ))}

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() =>
              setNewPrintDialogOpen(false)
            }
          >
            Cancelar
          </Button>

        </DialogActions>

      </Dialog>
    </>
  );
}