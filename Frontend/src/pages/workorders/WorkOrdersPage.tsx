import { useEffect, useState } from "react";

import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export default function WorkOrdersPage() {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [workOrders, setWorkOrders] =
    useState<any[]>(() => {
      const stored =
        localStorage.getItem(
          "rfidflow-workorders"
        );

      return stored
        ? JSON.parse(stored)
        : [];
    });

  useEffect(() => {
    localStorage.setItem(
      "rfidflow-workorders",
      JSON.stringify(workOrders)
    );
  }, [workOrders]);

  const createWorkOrder = () => {
    setWorkOrders([
      ...workOrders,
      {
        id: crypto.randomUUID(),
        title,
        description,
        status: "Abierta",
      },
    ]);

    setTitle("");
    setDescription("");

    setOpen(false);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Work Orders
      </Typography>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Nueva Orden
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>
                Descripción
              </TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {workOrders.map((wo) => (
              <TableRow key={wo.id}>
                <TableCell>
                  {wo.title}
                </TableCell>

                <TableCell>
                  {wo.description}
                </TableCell>

                <TableCell>
                  {wo.status}
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
          Nueva Orden
        </DialogTitle>

        <DialogContent>
          <TextField
            margin="dense"
            label="Título"
            fullWidth
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={createWorkOrder}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}