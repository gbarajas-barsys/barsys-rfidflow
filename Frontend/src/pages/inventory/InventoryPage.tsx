import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography
} from "@mui/material";

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);

  const [
  quantities,
  setQuantities,
] = useState<
  Record<string, number>
>(() => {
  const saved =
    localStorage.getItem(
      "inventory-quantities"
    );

  return saved
    ? JSON.parse(saved)
    : {};
});

const [
  rfidQuantities,
  setRfidQuantities,
] = useState<
  Record<string, number>
>(() => {
  const saved =
    localStorage.getItem(
      "inventory-rfid-quantities"
    );

  return saved
    ? JSON.parse(saved)
    : {};
});

const [open, setOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    sku: "",
    name: "",
    description: "",
    unitOfMeasure: "EA",
    active: true
  });

  const loadItems = () => {
    api
      .get("/v2/Items?page=1&pageSize=50")
      .then((response) => setItems(response.data))
      .catch(console.error);
  };

  useEffect(() => {
    loadItems();
  }, []);
useEffect(() => {
  localStorage.setItem(
    "inventory-quantities",
    JSON.stringify(
      quantities
    )
  );
}, [quantities]);
  const createItem = async () => {
    try {
      await api.post("/v2/Items", newItem);

      setOpen(false);

      setNewItem({
        sku: "",
        name: "",
        description: "",
        unitOfMeasure: "EA",
        active: true
      });

      loadItems();
    } catch (error) {
      console.error(error);
    }
  };
useEffect(() => {
  localStorage.setItem(
    "inventory-rfid-quantities",
    JSON.stringify(
      rfidQuantities
    )
  );
}, [rfidQuantities]);
  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Inventario
      </Typography>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Nuevo Item
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Expected Qty</TableCell>
              <TableCell>RFID Qty</TableCell>
              <TableCell>Difference</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                <TextField
  size="small"
  type="number"
  value={
    quantities[item.id] ?? 0
  }
  onChange={(e) =>
    setQuantities({
      ...quantities,
      [item.id]:
        Number(
          e.target.value
        ),
    })
  }
  sx={{ width: 90 }}
/>
              </TableCell>
                <TableCell>
  <TextField
    size="small"
    type="number"
    value={
      rfidQuantities[item.id] ?? 0
    }
    onChange={(e) =>
      setRfidQuantities({
        ...rfidQuantities,
        [item.id]:
          Number(
            e.target.value
          ),
      })
    }
    sx={{ width: 90 }}
  />
</TableCell>
                <TableCell
  sx={{
    fontWeight: "bold",
    color:
      ((rfidQuantities[item.id] ?? 0) -
        (quantities[item.id] ?? 0)) === 0
        ? "#4caf50"
        : ((rfidQuantities[item.id] ?? 0) -
            (quantities[item.id] ?? 0)) < 0
        ? "#f44336"
        : "#2196f3",
  }}
>
  {(rfidQuantities[item.id] ?? 0) -
    (quantities[item.id] ?? 0)}
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
        <DialogTitle>Nuevo Item</DialogTitle>

        <DialogContent>
          <TextField
            margin="dense"
            label="SKU"
            fullWidth
            value={newItem.sku}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                sku: e.target.value
              })
            }
          />

          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            value={newItem.name}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                name: e.target.value
              })
            }
          />

          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            value={newItem.description}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                description: e.target.value
              })
            }
          />

          <TextField
            margin="dense"
            label="Unidad"
            fullWidth
            value={newItem.unitOfMeasure}
            onChange={(e) =>
              setNewItem({
                ...newItem,
                unitOfMeasure: e.target.value
              })
            }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={createItem}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}