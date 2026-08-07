import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
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
const totalProducts =
  items.length;

const totalExpected =
  Object.values(
    quantities
  ).reduce(
    (sum, qty) =>
      sum + qty,
    0
  );

const totalRfid =
  Object.values(
    rfidQuantities
  ).reduce(
    (sum, qty) =>
      sum + qty,
    0
  );

const totalDifference =
  totalRfid -
  totalExpected;
  const matchedItems = items.filter(
  item =>
    (rfidQuantities[item.id] ?? 0) ===
    (quantities[item.id] ?? 0)
).length;

const varianceItems = items.filter(
  item =>
    (rfidQuantities[item.id] ?? 0) !==
    (quantities[item.id] ?? 0)
).length;

const accuracy =
  items.length > 0
    ? Math.round(
        (matchedItems / items.length) * 100
      )
    : 0;
const missingItems = items.filter(
  item =>
    (quantities[item.id] ?? 0) >
    (rfidQuantities[item.id] ?? 0)
).length;
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
      <Button
  variant="outlined"
  sx={{ mb: 2, ml: 2 }}
  onClick={() => {
    const csv = [
  "Inventory Summary",
  "",
  `Products,${totalProducts}`,
  `Variance,${varianceItems}`,
  `Accuracy,${accuracy}%`,
  `Matched,${matchedItems}`,
  `Missing,${missingItems}`,
  "",
  "SKU,Name,Expected Qty,RFID Qty,Difference",
      ...items.map((item) =>
        [
          item.sku,
          item.name,
          quantities[item.id] ?? 0,
          rfidQuantities[item.id] ?? 0,
          (rfidQuantities[item.id] ?? 0) -
            (quantities[item.id] ?? 0),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv",
      }
    );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      "InventoryResults.csv";

    a.click();

    window.URL.revokeObjectURL(
      url
    );
  }}
>
  Export CSV
</Button>
<Grid
  container
  spacing={2}
  sx={{ mb: 3 }}
>
  <Grid item xs={12} md={3}>
    <Card>
      <CardContent>
        <Typography>
          Products
        </Typography>

        <Typography variant="h4">
          {totalProducts}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} md={3}>
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        Variance
      </Typography>

      <Typography variant="h4">
  {varianceItems}
</Typography>
    </CardContent>
  </Card>
  </Grid>
  <Grid item xs={12} md={3}>
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        Accuracy %
      </Typography>

      <Typography variant="h4">
  {accuracy}%
</Typography>
    </CardContent>
  </Card>
</Grid>
<Grid item xs={12} md={3}>
  <Card>
    <CardContent>
      <Typography color="textSecondary" gutterBottom>
        Matched
      </Typography>

      <Typography variant="h4">
  {matchedItems}
</Typography>
    </CardContent>
  </Card>
</Grid>
</Grid>

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