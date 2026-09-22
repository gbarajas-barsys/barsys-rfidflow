import { useState } from "react";
import { useEffect } from "react";
import { api } from "../../api/apiClient";

import {
  Typography,
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
  Chip,
  Divider,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";

export default function RfidCenterPage() {
  const [assets, setAssets] =
  useState<any[]>([]);

  const [products, setProducts] =
  useState<any[]>([]);
  
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

    const [
      reprintPrinter,
      setReprintPrinter
    ] = useState("");

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
      selectedPrinter,
      setSelectedPrinter
    ] = useState("");

    const [
      search,
      setSearch
    ] = useState("");

    const [
      selectedItems,
      setSelectedItems
    ] = useState<any[]>([]);

    const [
      printers,
      setPrinters
    ] = useState<any[]>([]);

    const [
      templates,
      setTemplates
    ] = useState<any[]>([]);

    const [
      selectedTemplateId,
      setSelectedTemplateId
    ] = useState("");

   
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
  
  const loadPrinters =
    async () => {

      try {

        const response =
          await api.get(
            "/v2/rfid/printers"
          );

        const enabledPrinters =
          response.data.filter(
            (printer: any) =>
              printer.isEnabled
          );

        setPrinters(
          enabledPrinters
        );

        const defaultPrinter =
          enabledPrinters.find(
            (printer: any) =>
              printer.isDefault
          );

        if (defaultPrinter) {

          setSelectedPrinter(
            defaultPrinter.name
          );

          setReprintPrinter(
            defaultPrinter.name
          );

        }

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

  const loadTemplates =
    async () => {

      try {

        const response =
          await api.get(
            "/v2/rfid/templates"
          );

        setTemplates(
          response.data
        );

      } catch (error) {

        console.error(error);

      }

    };

      useEffect(() => {

        loadProducts();

        loadPrintJobs();

        loadAssets();

        loadPrinters();

        loadTemplates();

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

    const itemsWithoutRfid =
      selectedItems.filter(
        item =>
          item.item.rfidStrategy ===
          "SIN_RFID"
      );

    const individualItems =
      selectedItems.filter(
        item =>
          item.item.rfidStrategy ===
          "RFID_INDIVIDUAL"
      );

    const masterItems =
      selectedItems.filter(
        item =>
          item.item.rfidStrategy ===
          "RFID_MASTER"
      );
    
    const totalLabels =
      selectedItems.reduce(
        (acc, item) =>
          acc + item.quantity,
        0
      );

    const mixedStrategies =
      individualItems.length > 0 &&
      masterItems.length > 0;
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

      <Paper sx={{ mb: 2, py: 3 }}>
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight={600}
        >
          Trabajos de Impresión
        </Typography>

        <Typography
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 1 }}
        >
          Administre y monitoree los trabajos
          de impresión RFID.
        </Typography>
      </Paper>

      
        <Paper>
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar EPC, usuario, impresora o producto..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            sx={{ mb: 2 }}
          />
          
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Origen</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Impresora</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Acción</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>

              {
                printJobs
                  .filter(job => {

                    const value = `
                      ${job.name ?? ""}
                      ${job.epc ?? ""}
                      ${job.requestedByName ?? ""}
                      ${job.printerName ?? ""}
                      ${job.status ?? ""}
                      ${job.encodingType ?? ""}
                    `.toLowerCase();

                    return value.includes(
                      search.toLowerCase()
                    );

                  })
                  .map(job => (

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
                    <Chip
                      size="small"
                      color={
                        job.itemId
                          ? "info"
                          : "success"
                      }
                      label={
                        job.itemId
                          ? "Producto"
                          : "Activo"
                      }
                    />
                  </TableCell>

                  <TableCell>
                    {job.name ?? job.epc}
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
            {
              printers.map(
                printer => (

                  <MenuItem
                    key={printer.id}
                    value={printer.name}
                  >
                    {printer.name}
                  </MenuItem>

                )
              )
            }
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

                    itemId:
                      selectedPrintJob.itemId,

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

                setSelectedItems([]);

                setNewPrintDialogOpen(false);

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
            select
            fullWidth
            margin="dense"
            label="Impresora"
            value={selectedPrinter}
            onChange={(e) =>
              setSelectedPrinter(
                e.target.value
              )
            }
          >
            {
              printers.map(
                printer => (

                  <MenuItem
                    key={printer.id}
                    value={printer.name}
                  >
                    {printer.name}
                  </MenuItem>

                )
              )
            }
          </TextField>

          <TextField
            select
            fullWidth
            margin="dense"
            label="Plantilla"
            value={selectedTemplateId}
            onChange={(e) =>
              setSelectedTemplateId(
                e.target.value
              )
            }
          >

            {templates.map(
              template => (

                <MenuItem
                  key={template.id}
                  value={template.id}
                >
                  {template.name}
                </MenuItem>

              )
            )}

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
                            x => x.item.id === item.id
                          )
                        ) {
                          return prev;
                        }

                        return [
                          ...prev,
                          {
                            item,
                            quantity: 1
                          }
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

            <Typography
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              RFID Individual:
              {" "}
              {individualItems.length}
              {" | "}
              RFID Master:
              {" "}
              {masterItems.length}
              {" | "}
              Sin RFID:
              {" "}
              {itemsWithoutRfid.length}
            </Typography>

            <Typography
              color="primary"
              fontWeight={600}
              sx={{ mt: 1 }}
            >
              Total etiquetas a imprimir:
              {" "}
              {totalLabels}
            </Typography>

            <Typography
              color="success.main"
              sx={{ mt: 1 }}
            >
              Impresora seleccionada:
              {" "}
              {selectedPrinter}
            </Typography>


            {selectedItems.map(selection => (

              <Box
                key={selection.item.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1
                }}
              >

                <Chip
                  label={`${selection.item.name} x${selection.quantity} - ${
                    printTargetType === "ASSET"
                      ? "ACTIVO"
                      : (selection.item.rfidStrategy ?? "SIN_CONFIGURAR")
                  }`}
                  onDelete={() => {

                    setSelectedItems(prev =>
                      prev.filter(
                        x =>
                          x.item.id !==
                          selection.item.id
                      )
                    );

                  }}
                />

                <TextField
                  type="number"
                  size="small"
                  label="Cantidad"
                  value={selection.quantity}
                  inputProps={{
                    min: 1,
                    max:
                      selection.item.rfidStrategy ===
                      "RFID_MASTER"
                        ? 1
                        : 999
                  }}
                  disabled={
                    selection.item.rfidStrategy ===
                    "RFID_MASTER"
                  }
                  onChange={(e) => {

                    const quantity =
                      Number(
                        e.target.value
                      );

                    setSelectedItems(prev =>
                      prev.map(x =>
                        x.item.id ===
                        selection.item.id
                          ? {
                              ...x,
                              quantity
                            }
                          : x
                      )
                    );
                  }}
                  sx={{ width: 120 }}
                />

              </Box>

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
            
          {
            itemsWithoutRfid.length > 0 && (
              <Typography
                color="error"
                sx={{ mr: 2 }}
              >
                Existen productos configurados
                como SIN_RFID. No pueden
                imprimirse etiquetas RFID.
              </Typography>
            )
          }

          {
            mixedStrategies && (
              <Typography
                color="warning.main"
                sx={{ mr: 2 }}
              >
                No puede mezclar productos
                RFID Individual y RFID Master
                en la misma impresión.
              </Typography>
            )
          }

          <Button
              variant="contained"
              disabled={
                selectedItems.length === 0 ||
                itemsWithoutRfid.length > 0 ||
                mixedStrategies
              }
            onClick={async () => {

              try {

                for (
                  const selection
                  of selectedItems
                ) {

                  for (
                    let i = 0;
                    i < selection.quantity;
                    i++
                  ) {

                    const item =
                      selection.item;

                    const epcResponse =
                      await api.post(
                        "/v2/rfid/epc/generate",
                        {
                          encoding:
                            item.rfidStrategy ===
                            "RFID_MASTER"
                              ? "SGTIN"
                              : "EPC_GEN2"
                        }
                      );

                    await api.post(
                      "/v2/rfid/print-jobs",
                      {
                        assetId:
                          printTargetType === "ASSET"
                            ? item.id
                            : null,

                        itemId:
                          printTargetType === "PRODUCT"
                            ? item.id
                            : null,

                        epc:
                          epcResponse.data.epc,

                        encodingType:
                          item.rfidStrategy ===
                          "RFID_MASTER"
                            ? "SGTIN"
                            : "EPC_GEN2",

                        labelTemplateId:
                          selectedTemplateId,

                        labelTemplate:
                          templates.find(
                            x =>
                              x.id === selectedTemplateId
                          )?.name,

                        printerName:
                          selectedPrinter,

                        requestedByName:
                          currentUser?.displayName ??
                          "Barsys Administrator",

                        isReprint: false,

                        originalPrintJobId: null,

                        reprintReason: null
                      }
                    );

                  }

                                }

                await loadPrintJobs();

                setSelectedItems([]);

                setNewPrintDialogOpen(false);

              } catch (error) {

                console.error(error);

              }

            }}
          >
            Imprimir
          </Button>

        </DialogActions>

      </Dialog>
    </>
  );
}