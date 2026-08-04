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
  Grid,
  Card,
  CardContent,
  MenuItem,
} from "@mui/material";

export default function WorkOrdersPage() {
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [selectedAsset, setSelectedAsset] =
    useState("");

  const [assets] = useState<any[]>(() => {
    const stored =
      localStorage.getItem("rfidflow-assets");

    return stored ? JSON.parse(stored) : [];
  });

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
        asset: selectedAsset,
        status: "Abierta",
        createdAt:
          new Date().toLocaleDateString(),
      },
    ]);

    setTitle("");
    setDescription("");
    setSelectedAsset("");

    setOpen(false);
  };

  const updateStatus = (
    id: string,
    status: string
  ) => {
    setWorkOrders(
      workOrders.map((wo) =>
        wo.id === id
          ? {
              ...wo,
              status,
            }
          : wo
      )
    );
  };

  const total =
    workOrders.length;

  const abiertas =
    workOrders.filter(
      (wo) => wo.status === "Abierta"
    ).length;

  const progreso =
    workOrders.filter(
      (wo) =>
        wo.status === "En Progreso"
    ).length;

  const cerradas =
    workOrders.filter(
      (wo) => wo.status === "Cerrada"
    ).length;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Work Orders
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Total
              </Typography>

              <Typography variant="h3">
                {total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Abiertas
              </Typography>

              <Typography variant="h3">
                {abiertas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                En Progreso
              </Typography>

              <Typography variant="h3">
                {progreso}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Cerradas
              </Typography>

              <Typography variant="h3">
                {cerradas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                Asset
              </TableCell>

              <TableCell>
                Descripción
              </TableCell>

              <TableCell>
                Estado
              </TableCell>

              <TableCell>
                Cambiar Estado
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {workOrders.map((wo) => (
              <TableRow key={wo.id}>
                <TableCell>
                  {wo.title}
                </TableCell>

                <TableCell>
                  {wo.asset || "-"}
                </TableCell>

                <TableCell>
                  {wo.description}
                </TableCell>

                <TableCell>
                  {wo.status}
                </TableCell>

                <TableCell>
                  <TextField
                    select
                    size="small"
                    value={wo.status}
                    onChange={(e) =>
                      updateStatus(
                        wo.id,
                        e.target.value
                      )
                    }
                  >
                    <MenuItem value="Abierta">
                      Abierta
                    </MenuItem>

                    <MenuItem value="En Progreso">
                      En Progreso
                    </MenuItem>

                    <MenuItem value="Cerrada">
                      Cerrada
                    </MenuItem>
                  </TextField>
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
            select
            margin="dense"
            label="Asset"
            fullWidth
            value={selectedAsset}
            onChange={(e) =>
              setSelectedAsset(
                e.target.value
              )
            }
          >
            {assets.map((asset) => (
              <MenuItem
                key={asset.id}
                value={asset.name}
              >
                {asset.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) =>
              setDescription(
                e.target.value
              )
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