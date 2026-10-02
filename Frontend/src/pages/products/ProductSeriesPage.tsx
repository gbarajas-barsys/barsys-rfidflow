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

        try {

        await api.post(
        "/v2/SerializedUnits",
        {
            itemId: id,
            serialNumber,
            vin,
            binCode,
            brand,
            model,
            status: "REGISTERED"
        }
        );

        setSerialNumber("");
        setVin("");
        setBinCode("");
        setBrand("");
        setModel("");

        setOpen(false);

        await loadSeries();

        loadSeries();

        } catch (error) {

        console.error(error);

        alert(
            "Error creando serie"
        );
        }
    };

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

    const [brand,
    setBrand] =
    useState("");

    const [model,
    setModel] =
    useState("");

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

        <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpen(true)}
        >
        Nueva Serie
        </Button>

      <Paper>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell>Serie</TableCell>
              <TableCell>VIN</TableCell>
              <TableCell>BIN</TableCell>
              <TableCell>Marca</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>EPC</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {series.map((item) => (
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
                   {item.brand}
                </TableCell>

                <TableCell>
                  {item.model}
                </TableCell>

                <TableCell>
                  {item.epc ?? "-"}
                </TableCell>

                <TableCell>
                  {item.status}
                </TableCell>

              </TableRow>
            ))}
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
            margin="dense"
            label="Serie"
            value={serialNumber}
            onChange={(e) =>
                setSerialNumber(
                e.target.value
                )
            }
            />

            <TextField
            fullWidth
            margin="dense"
            label="VIN"
            value={vin}
            onChange={(e) =>
                setVin(
                e.target.value
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

            <TextField
            fullWidth
            margin="dense"
            label="Marca"
            value={brand}
            onChange={(e) =>
                setBrand(
                e.target.value
                )
            }
            />

            <TextField
            fullWidth
            margin="dense"
            label="Modelo"
            value={model}
            onChange={(e) =>
                setModel(
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
    </>    
  );
}