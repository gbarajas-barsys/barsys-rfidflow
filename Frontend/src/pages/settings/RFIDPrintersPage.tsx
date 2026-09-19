import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";

export default function RFIDPrintersPage() {

  const [printers, setPrinters] =
    useState<any[]>([]);

  const [
    newPrinterDialogOpen,
    setNewPrinterDialogOpen
    ] = useState(false);

    const [printerName,
    setPrinterName] =
    useState("");

    const [printerIp,
    setPrinterIp] =
    useState("");

    const [printerPort,
    setPrinterPort] =
    useState(9100);

    const [printerModel,
    setPrinterModel] =
    useState("");

    const [isDefault,
    setIsDefault] =
    useState(false);

    const [isEnabled,
    setIsEnabled] =
    useState(true);

    const [
    editingPrinter,
    setEditingPrinter
    ] = useState<any>(null);

    const [
    connectivity,
    setConnectivity
    ] = useState<
    Record<string, string>
    >({});

  const loadPrinters =
    async () => {

      try {

        const response =
          await api.get(
            "/v2/rfid/printers"
          );

        setPrinters(
          response.data
        );

      } catch (error) {

        console.error(error);

      }

    };

  useEffect(() => {

    loadPrinters();

  }, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">
          Impresoras RFID
        </Typography>

        <Button
        variant="contained"
        color="primary"
        onClick={() =>
            setNewPrinterDialogOpen(true)
        }
        >
        Nueva Impresora
        </Button>
      </Box>

      <Paper
        sx={{
          mb: 2,
          py: 3
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          fontWeight={600}
        >
          Administración de Impresoras RFID
        </Typography>

        <Typography
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 1 }}
        >
          Configure impresoras Zebra,
          puertos, IPs y estado operativo.
        </Typography>
      </Paper>

      <Paper>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>
                Nombre
              </TableCell>

              <TableCell>
                Modelo
              </TableCell>

              <TableCell>
                Dirección IP
              </TableCell>

              <TableCell>
                Conectividad
              </TableCell>

              <TableCell>
                Estado
              </TableCell>

              <TableCell>
                Predeterminada
              </TableCell>

              <TableCell>
                Acciones
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {printers.map(
              printer => (

                <TableRow
                  key={printer.id}
                >

                  <TableCell>
                    {printer.name}
                  </TableCell>

                  <TableCell>
                    {printer.model}
                  </TableCell>

                  <TableCell>
                    {printer.ipAddress}
                  </TableCell>

                  <TableCell>

                    {
                        connectivity[printer.id]
                        ? (
                            <Chip
                            size="small"
                            label={
                                connectivity[
                                printer.id
                                ]
                            }
                            color={
                                connectivity[
                                printer.id
                                ] === "Online"
                                ? "success"
                                : "error"
                            }
                            />
                        )
                        : (
                            <Chip
                            size="small"
                            label="Sin comprobar"
                            color="default"
                            />
                        )
                    }

                    </TableCell>

                  <TableCell>

                    <Chip
                      size="small"
                      color={
                        printer.isEnabled
                          ? "success"
                          : "error"
                      }
                      label={
                        printer.isEnabled
                          ? "Activa"
                          : "Inactiva"
                      }
                    />

                  </TableCell>

                  <TableCell>

                    {
                        printer.isDefault

                        ? (

                            <Chip
                            size="small"
                            color="primary"
                            label="Default"
                            />

                        )

                        : (

                            <Button
                            size="small"
                            variant="outlined"
                            onClick={async () => {

                                try {

                                await api.patch(
                                    `/v2/rfid/printers/${printer.id}/default`
                                );

                                await loadPrinters();

                                } catch (error) {

                                console.error(error);

                                }

                            }}
                            >
                            Hacer Default
                            </Button>

                        )
                    }

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
                        color="info"
                        variant="outlined"
                        onClick={async () => {

                            try {

                            const response =
                                await api.post(
                                `/v2/rfid/printers/${printer.id}/test`
                                );

                            setConnectivity(
                                prev => ({
                                ...prev,
                                [printer.id]:
                                    response.data.status
                                })
                            );

                            } catch (error) {

                            console.error(error);

                            setConnectivity(
                                prev => ({
                                ...prev,
                                [printer.id]:
                                    "Offline"
                                })
                            );

                            }

                        }}
                        >
                        Probar
                        </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {

                            setEditingPrinter(
                            printer
                            );

                            setPrinterName(
                            printer.name
                            );

                            setPrinterIp(
                            printer.ipAddress
                            );

                            setPrinterPort(
                            printer.port
                            );

                            setPrinterModel(
                            printer.model
                            );

                            setNewPrinterDialogOpen(
                            true
                            );

                        }}
                        >
                        Editar
                        </Button>

                      <Button
                        size="small"
                        color={
                            printer.isEnabled
                            ? "error"
                            : "success"
                        }
                        variant="outlined"
                        onClick={async () => {

                            try {

                            await api.patch(

                                printer.isEnabled

                                ? `/v2/rfid/printers/${printer.id}/disable`

                                : `/v2/rfid/printers/${printer.id}/enable`

                            );

                            await loadPrinters();

                            } catch (error) {

                            console.error(error);

                            }

                        }}
                        >
                        {
                            printer.isEnabled
                            ? "Desactivar"
                            : "Activar"
                        }
                        </Button>

                    </Box>

                  </TableCell>

                </TableRow>

              )
            )}

          </TableBody>

        </Table>

      </Paper>
    
        <Dialog
            open={newPrinterDialogOpen}
            onClose={() =>
            setNewPrinterDialogOpen(false)
            }
            maxWidth="sm"
            fullWidth
        >

            <DialogTitle>
            Nueva Impresora RFID
            </DialogTitle>

            <DialogContent>

            <TextField
                fullWidth
                margin="dense"
                label="Nombre"
                value={printerName}
                onChange={(e) =>
                setPrinterName(
                    e.target.value
                )
                }
            />

            <TextField
                fullWidth
                margin="dense"
                label="IP"
                value={printerIp}
                onChange={(e) =>
                setPrinterIp(
                    e.target.value
                )
                }
            />

            <TextField
                fullWidth
                margin="dense"
                label="Puerto"
                type="number"
                value={printerPort}
                onChange={(e) =>
                setPrinterPort(
                    Number(
                    e.target.value
                    )
                )
                }
            />

            <TextField
                fullWidth
                margin="dense"
                label="Modelo"
                value={printerModel}
                onChange={(e) =>
                setPrinterModel(
                    e.target.value
                )
                }
            />

            </DialogContent>

            <DialogActions>

            <Button
                onClick={() =>
                setNewPrinterDialogOpen(false)
                }
            >
                Cancelar
            </Button>

            <Button
                variant="contained"
                onClick={async () => {

                try {

                    if (editingPrinter) {

                    await api.patch(
                        `/v2/rfid/printers/${editingPrinter.id}`,
                        {
                        name:
                            printerName,

                        ipAddress:
                            printerIp,

                        port:
                            printerPort,

                        model:
                            printerModel
                        }
                    );

                    } else {

                    await api.post(
                        "/v2/rfid/printers",
                        {
                        name:
                            printerName,

                        ipAddress:
                            printerIp,

                        port:
                            printerPort,

                        model:
                            printerModel,

                        isDefault,

                        isEnabled
                        }
                    );

                    }

                    await loadPrinters();

                    setNewPrinterDialogOpen(
                    false
                    );

                    setPrinterName("");
                    setPrinterIp("");
                    setPrinterPort(9100);
                    setPrinterModel("");
                    setEditingPrinter(
                    null
                    );

                } catch (error) {

                    console.error(error);

                }

                }}
            >
                Guardar
            </Button>

            </DialogActions>

        </Dialog>

    </>
  );
}