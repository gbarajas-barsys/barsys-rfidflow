import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { api } from "../../api/apiClient";

import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

export default function ProductSeriesPage() {
  const { id } = useParams();

  const [historyOpen,
    setHistoryOpen] =
    useState(false);

    const [history,
    setHistory] =
    useState<any[]>([]);

  const [series, setSeries] =
    useState<any[]>([]);

  const loadSeries =
    async () => {
      try {
        const response =
          await api.get(
            `/v2/Items/${id}/SerializedUnits`
          );

        setSeries(
          response.data
        );
      } catch (error) {
        console.error(error);
      }
    };

   const createSeries =
    async () => {

        if (!vin.trim()) {

        alert(
            "El VIN es obligatorio."
        );

        return;
        }

        if (vin.length !== 17) {

        alert(
            "El VIN debe contener 17 caracteres."
        );

        return;
        }

        try {

        await api.post(
        "/v2/SerializedUnits",
        {
            itemId: id,
            serialNumber,
            vin,
            binCode,
            status: "REGISTERED"
        }
        );

        setSerialNumber("");
        setVin("");
        setBinCode("");

        setOpen(false);

        await loadSeries();

        } catch (error) {

        console.error(error);

        alert(
            "Error creando serie"
        );
        }
    };

    const deleteSeries = async (
    id: string
    ) => {

    if (
        !window.confirm(
        "¿Eliminar serie?"
        )
    ) {
        return;
    }

    try {

        await api.delete(
        `/v2/SerializedUnits/${id}`
        );

        await loadSeries();

    } catch (error) {

        console.error(error);

        alert(
        "Error eliminando serie"
        );

    }

    };

    const generateEpc =
    async (item: any) => {

        const epc =
        crypto
            .randomUUID()
            .replaceAll("-", "")
            .substring(0, 24);

        try {

        await api.patch(
        `/v2/SerializedUnits/${item.id}`,
        {
            itemId:
            item.itemId,

            serialNumber:
            item.serialNumber,

            vin:
            item.vin,

            binCode:
            item.binCode,

            brand:
            item.brand,

            model:
            item.model,

            status:
            item.status,

            epc
        }
        );

        await loadSeries();

        } catch (error) {

        console.error(error);

        alert(
            "Error generando EPC"
        );

        }
    };

    const loadHistory =
    async (item: any) => {

        try {

        const response =
            await api.get(
            `/v2/SerializedUnits/${item.id}/history`
        );

        setSelectedUnit(
            item
        );

        setHistory(
            response.data
        );

        setHistoryOpen(
            true
        );

        } catch (error) {

        console.error(error);

        alert(
            "Error cargando historial"
        );

        }
    };

    const createWorkOrderFromEvent =
    async (event: any) => {

        setSelectedEvent(
            event
        );

        setReturnSummary(
            ""
        );

        setWorkOrderOpen(true);

    };

    const saveWorkOrder =
    async () => {

        try {

            const response =
            await api.post(
                `/v2/SerializedUnits/events/${selectedEvent.id}/work-order`,
                {
                    title:
                        `Garantía motor VIN ${selectedUnit.vin}`,

                    description:
            `
            Motivo:
            ${selectedEvent.comments}

            Resumen:
            ${returnSummary}
            `
                }
            );

            alert(
                `WO creada: ${response.data.workOrderNumber}`
            );

            setWorkOrderOpen(false);

            setHistoryOpen(false);

            await loadHistory(
                selectedUnit
            );

        } catch (error) {

            console.error(error);

            alert(
                "Error creando Work Order"
            );

        }

    };

    const [selectedUnit,
    setSelectedUnit] =
    useState<any>(null);

    const [workOrderOpen,
    setWorkOrderOpen] =
    useState(false);

    const [returnSummary,
    setReturnSummary] =
    useState("");

    const [selectedEvent,
    setSelectedEvent] =
    useState<any>(null);

    const [open, setOpen] =
    useState(false);

    const [serialNumber,
    setSerialNumber] =
    useState("");

    const [vin,
    setVin] =
    useState("");

    const [binCode,
    setBinCode] =
    useState("");

    const [search, setSearch] =
    useState("");

    const filteredSeries =
    series.filter(
        s =>
        s.serialNumber
            ?.toLowerCase()
            .includes(
            search.toLowerCase()
            ) ||
        s.vin
            ?.toLowerCase()
            .includes(
            search.toLowerCase()
            )
    );

    useEffect(() => {
    loadSeries();
  }, [id]);

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
      >
        Series del Producto
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
            mb: 2,
            fontWeight: "bold"
        }}
        >
        Total Series: {filteredSeries.length}
        </Typography>

        <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpen(true)}
        >
        Nueva Serie
        </Button>

        <TextField
        fullWidth
        label="Buscar Serie"
        value={search}
        onChange={(e) =>
            setSearch(e.target.value)
        }
        sx={{
            mb: 2,
            mt: 1
        }}
        />

      <Paper>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>Serie</TableCell>
              <TableCell>VIN</TableCell>
              <TableCell>BIN</TableCell>
              <TableCell>EPC</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredSeries.map((item) => (
              <TableRow
                key={item.id}
              >
                <TableCell>
                  {item.serialNumber}
                </TableCell>

                <TableCell>
                  {item.vin}
                </TableCell>

                <TableCell>
                  {item.binCode}
                </TableCell>

                <TableCell>
                  {item.epc ?? "-"}
                </TableCell>

                <TableCell>
                  {item.status}
                </TableCell>

                <TableCell>

                <Button
                    size="small"
                    color="primary"
                    onClick={() =>
                    generateEpc(item)
                    }
                >
                    EPC
                </Button>

                <Button
                size="small"
                onClick={() =>
                    loadHistory(
                        item
                    )
                }
                >
                Historial
                </Button>

                <Button
                    color="error"
                    size="small"
                    onClick={() =>
                    deleteSeries(item.id)
                    }
                >
                    Eliminar
                </Button>

                </TableCell>

              </TableRow>
            ))}
            {filteredSeries.length === 0 && (
            <TableRow>
                <TableCell
                colSpan={8}
                align="center"
                >
                No existen series
                </TableCell>
            </TableRow>
            )}
         </TableBody>
        </Table>
      </Paper>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        >

        <DialogTitle>
            Nueva Serie
        </DialogTitle>

        <DialogContent>

            <TextField
            fullWidth
            required
            margin="dense"
            label="VIN *"
            value={vin}
            inputProps={{
                maxLength: 17
            }}
            onChange={(e) =>
                setVin(
                e.target.value
                    .toUpperCase()
                )
            }
            />

            <TextField
            fullWidth  margin="dense"
            label="Serie"
            value={serialNumber}
            onChange={(e) =>
                setSerialNumber(e.target.value
                )
            }
            />
            <TextField
            fullWidth
            margin="dense"
            label="BIN"
            value={binCode}
            onChange={(e) =>
                setBinCode(
                e.target.value
                )  
              }
            />

        </DialogContent>

        <DialogActions>

            <Button
            onClick={() =>
                setOpen(false)
            }
            >
            Cancelar
            </Button>

            <Button
            variant="contained"
            onClick={createSeries}
            >
            Guardar
            </Button>

        </DialogActions>

        </Dialog>

        <Dialog
        open={historyOpen}
        onClose={() =>
            setHistoryOpen(false)
        }
        >
        <DialogTitle>
            Historial
        </DialogTitle>

        <DialogContent>

        {selectedUnit && (
            <>
            <Typography
                variant="subtitle1"
                fontWeight="bold"
            >
                VIN: {selectedUnit.vin}
            </Typography>

             <br />
            </>
        )}

        {history.map(
            (event) => (

            <div key={event.id}>

                <strong>
                {event.eventType}
                </strong>

                <br />

                {
                new Date(
                    event.occurredAt
                ).toLocaleString()
                }

                {event.comments && (
                <>
                    <br />

                    <span
                    style={{
                        color: "#666"
                    }}
                    >
                    {event.comments}
                    </span>
                </>
                )}

                {event.eventType === "REINGRESO" &&
                !event.workOrderId && (

                <>
                    <br />

                    <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                        createWorkOrderFromEvent(
                        event
                        )
                    }
                    >
                    Crear WO
                    </Button>

                </>
                )}

                {event.workOrderId && (

                <>
                    <br />

                    <Typography
                    variant="body2"
                    color="primary"
                    >
                    WO vinculada
                    </Typography>

                    <Button
                    size="small"
                    >
                    Ver WO
                    </Button>

                </>
                )}

                <hr />

            </div>

            )
        )}

        </DialogContent>

        <DialogActions>

            <Button
            onClick={() =>
                setHistoryOpen(false)
            }
            >
            Cerrar
            </Button>

        </DialogActions>

        </Dialog>

        <Dialog
            open={workOrderOpen}
            onClose={() =>
                setWorkOrderOpen(false)
            }
            >
            <DialogTitle>
                Nueva Orden de Trabajo
            </DialogTitle>

            <DialogContent>

                <Typography>
                VIN: {selectedUnit?.vin}
                </Typography>

                <Typography
                sx={{ mt: 2 }}
                >
                Motivo: {selectedEvent?.comments}
                </Typography>

                <TextField
                fullWidth
                multiline
                rows={5}
                margin="dense"
                label="Resumen del retorno"
                value={returnSummary}
                onChange={(e) =>
                    setReturnSummary(
                    e.target.value
                    )
                }
                />

            </DialogContent>

            <DialogActions>

                <Button
                onClick={() =>
                    setWorkOrderOpen(false)
                }
                >
                Cancelar
                </Button>

                <Button
                variant="contained"
                onClick={saveWorkOrder}
                >
                Crear WO
                </Button>

            </DialogActions>

            </Dialog>
    </>    
  );
}