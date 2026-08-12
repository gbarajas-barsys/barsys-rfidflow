import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";

import {
  Box,
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

  const [
  selectedSession,
  setSelectedSession,
] = useState<any | null>(null);

const [
  sessionDetailOpen,
  setSessionDetailOpen,
] = useState(false);

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

const inventorySessions =
  JSON.parse(
    localStorage.getItem(
      "rfidflow-inventory-sessions"
    ) ?? "[]"
  );
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
<Button
  variant="contained"
  color="success"
  sx={{ mb: 2, ml: 2 }}
  onClick={() => {
    const inventorySession = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      totalProducts,
      varianceItems,
      accuracy,
      matchedItems,
      missingItems,
      items: items.map((item) => ({
        sku: item.sku,
        name: item.name,
        expectedQty:
          quantities[item.id] ?? 0,
        rfidQty:
          rfidQuantities[item.id] ?? 0,
        difference:
          (rfidQuantities[item.id] ?? 0) -
          (quantities[item.id] ?? 0),
      })),
    };

    const existingSessions =
      JSON.parse(
        localStorage.getItem(
          "rfidflow-inventory-sessions"
        ) ?? "[]"
      );

    localStorage.setItem(
      "rfidflow-inventory-sessions",
      JSON.stringify([
        inventorySession,
        ...existingSessions,
      ])
    );
  }}
>
  Save Session
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
<Paper
  sx={{
    p: 2,
    mb: 3,
  }}
>
  <Typography
    variant="h6"
    gutterBottom
  >
    Recent Inventory Sessions
  </Typography>

  {inventorySessions
  .slice(0, 5)
  .map((session: any) => (
    <Box
      key={session.id}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        mb: 1,
      }}
    >
      <Typography variant="body2">
        {new Date(
          session.date
        ).toLocaleString()}
        {" | "}
        Accuracy:
        {" "}
        {session.accuracy}%
        {" | "}
        Variance:
        {" "}
        {session.varianceItems}
      </Typography>

      <Button
        size="small"
        onClick={() => {
          setSelectedSession(
            session
          );

          setSessionDetailOpen(
            true
          );
        }}
      >
        View
      </Button>
    </Box>
))}
</Paper>
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
      <Dialog
  open={sessionDetailOpen}
  onClose={() =>
    setSessionDetailOpen(false)
  }
>
  <DialogTitle>
    Inventory Session Detail
  </DialogTitle>

  <DialogContent>
    <Typography>
      Accuracy:
      {" "}
      {selectedSession?.accuracy}%
    </Typography>

    <Typography>
      Variance:
      {" "}
      {selectedSession?.varianceItems}
    </Typography>
    
    <Typography>
      Matched:
      {" "}
      {selectedSession?.matchedItems}
    </Typography>

    <Typography>
      Missing:
      {" "}
      {selectedSession?.missingItems}
    </Typography>

<Table sx={{ mt: 2 }}>
  <TableHead>
    <TableRow>
      <TableCell>SKU</TableCell>
      <TableCell>Name</TableCell>
      <TableCell>Expected</TableCell>
      <TableCell>RFID</TableCell>
      <TableCell>Difference</TableCell>
    </TableRow>
  </TableHead>

  <TableBody>
    {selectedSession?.items?.map(
      (item: any) => (
        <TableRow key={item.sku}>
          <TableCell>
            {item.sku}
          </TableCell>

          <TableCell>
            {item.name}
          </TableCell>

          <TableCell>
            {item.expectedQty}
          </TableCell>

          <TableCell>
            {item.rfidQty}
          </TableCell>

          <TableCell>
            {item.difference}
          </TableCell>
        </TableRow>
      )
    )}
  </TableBody>
</Table>
</DialogContent>
  <DialogActions>
    <Button
      onClick={() =>
        setSessionDetailOpen(false)
      }
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
    </div>
  );
}