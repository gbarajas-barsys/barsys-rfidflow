import { useEffect, useState } from "react";
import { api } from "../../api/apiClient";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
  Typography,
  MenuItem,
} from "@mui/material";

export default function InventoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
  const [movements, setMovements] =
  useState<any[]>([]);
  const [locations, setLocations] =
  useState<any[]>([]);

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

const [
  movementOpen,
  setMovementOpen
] = useState(false);

const [
  selectedSession,
  setSelectedSession,
] = useState<any | null>(null);

const [
  sessionDetailOpen,
  setSessionDetailOpen,
] = useState(false);

const [
  movementFilter,
  setMovementFilter
] = useState("ALL");

const [
  productFilter,
  setProductFilter
] = useState("");

  const [
    newMovement,
    setNewMovement
  ] = useState({
    movementType: 0,
    itemId: "",
    quantity: 1,
    lotNumber: "",
    referenceType: "",
    locationId: ""
  });

  const movementTypes: Record<number, string> = {
    0: "Entrada",
    1: "Acomodo",
    2: "Traspaso",
    3: "Ajuste",
    4: "Salida",
    5: "Devolución",
    6: "Embarque",
    7: "Conteo Cíclico"
  };

  const referenceLabels:
    Record<string, string> = {
    InitialLoad: "Carga Inicial",
    TestIssue: "Salida de Prueba"
  };

  const loadItems = () => {
    api
      .get("/v2/Items?page=1&pageSize=50")
      .then((response) => setItems(response.data))
      .catch(console.error);
  };

  const loadMovements = async () => {
      try {
        const response =
          await api.get(
            "/v2/inventory/movements?page=1&pageSize=50"
          );

        setMovements(
          response.data
        );
      } catch (error) {
        console.error(
          "Error loading movements",
          error
        );
      }
    };

  const loadLocations = async () => {
    try {
      const response =
        await api.get(
          "/v2/Locations?page=1&pageSize=50"
        );

      setLocations(
        response.data
      );
    } catch (error) {
      console.error(
        "Error loading locations",
        error
      );
    }
  };

  useEffect(() => {
    loadItems();
    loadMovements();
    loadLocations();
  }, []);
useEffect(() => {
  localStorage.setItem(
    "inventory-quantities",
    JSON.stringify(
      quantities
    )
  );
}, [quantities]);
  
  const createMovement = async () => {
  console.log("createMovement ejecutado");

  try {
    if (!newMovement.itemId) {
      alert(
        "Seleccione un producto"
      );
      return;
    }

    const payload = {
      movementType: newMovement.movementType,
      itemId:
        newMovement.itemId,
      quantity: Number(
        newMovement.quantity
      ),
      lotNumber:
        newMovement.lotNumber,
      referenceType:
        newMovement.referenceType,
      occurredAt:
        new Date().toISOString(),
      fromLocationId:
        newMovement.movementType === 4
          ? newMovement.locationId
          : null,

        toLocationId:
          newMovement.movementType === 0
            ? newMovement.locationId
            : null
    };

    console.log(
      "Payload:",
      payload
    );

    const response =
      await api.post(
        "/v2/inventory/movements",
        payload
      );

    console.log(
      "Respuesta:",
      response.data
    );

    setMovementOpen(false);

    setNewMovement({
      movementType: 0,
      itemId: "",
      quantity: 1,
      lotNumber: "",
      referenceType: "",
      locationId: ""
    });

    loadMovements();

  } catch (error: any) {
    console.error(
      "ERROR COMPLETO:",
      error
    );

    console.error(
      "ERROR RESPONSE:",
      error?.response?.data
    );
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

const totalEntradas =
  movements
    .filter(
      m => m.movementType === 0
    )
    .reduce(
      (sum, m) =>
        sum + m.quantity,
      0
    );

const totalSalidas =
  movements
    .filter(
      m => m.movementType === 4
    )
    .reduce(
      (sum, m) =>
        sum + m.quantity,
      0
    );

const saldoActual =
  totalEntradas - totalSalidas;

const itemLookup =
  Object.fromEntries(
    items.map(item => [
      item.id,
      item
    ])
  );

console.log(
  "Filtro:",
  movementFilter
);

const filteredMovements =
  movements.filter(
    (movement) => {

      const matchesType =
        movementFilter ===
          "ALL" ||
        movement.movementType ===
          Number(
            movementFilter
          );

      const matchesProduct =
        !productFilter ||
        movement.itemId ===
          productFilter;

      return (
        matchesType &&
        matchesProduct
      );
    }
  );
  
  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Inventario
      </Typography>

      <Button
        variant="contained"
        onClick={() =>
          navigate("/products")
        }
        sx={{ mb: 2 }}
      >
        Administrar Productos
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
  Exportar CSV
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
  Guardar Conteo
</Button>

<Button
  variant="contained"
  color="warning"
  sx={{ mb: 2, ml: 2 }}
  onClick={() =>
    setMovementOpen(true)
  }
>
  Nuevo Movimiento
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
          Productos
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
        Diferencias
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
        Precisión %
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
        Coincidentes
      </Typography>

      <Typography variant="h4">
  {matchedItems}
</Typography>
    </CardContent>
  </Card>
</Grid>

<Grid item xs={12} md={3}>
  <Card>
    <CardContent>
      <Typography
        color="textSecondary"
        gutterBottom
      >
        Faltantes
      </Typography>

      <Typography
        variant="h4"
        color="error"
      >
        {missingItems}
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
    Conteos Recientes
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
        Precisión:
        {" "}
        {session.accuracy}%
        {" | "}
        Diferencias:
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
        Ver
      </Button>
    </Box>
))}
</Paper>

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
    Movimientos de Inventario
  </Typography>

  <Box
  sx={{
    display: "flex",
    gap: 2,
    mb: 2,
    flexWrap: "wrap",
  }}
>

  <TextField
  select
  size="small"
  label="Movimiento"
  value={movementFilter}
  onChange={(e) =>
    setMovementFilter(
      e.target.value
    )
  }
>
  <MenuItem value="ALL">
    Todos
  </MenuItem>

  <MenuItem value="0">
    Entradas
  </MenuItem>

  <MenuItem value="4">
    Salidas
  </MenuItem>

  <MenuItem value="2">
    Traspasos
  </MenuItem>

  <MenuItem value="3">
    Ajustes
  </MenuItem>

</TextField>

  <TextField
    select
    size="small"
    label="Producto"
    value={productFilter}
    onChange={(e) =>
      setProductFilter(
        e.target.value
      )
    }
    sx={{ minWidth: 300 }}
  >
    <MenuItem value="">
      Todos
    </MenuItem>

    {items.map((item) => (
      <MenuItem
        key={item.id}
        value={item.id}
      >
        {item.sku} - {item.name}
      </MenuItem>
    ))}
  </TextField>

</Box>
<Typography
  variant="body2"
  sx={{ mb: 1 }}
>
  Mostrando
  {" "}
  {filteredMovements.length}
  {" "}
  movimientos
</Typography>
  <Box
  sx={{
    maxHeight: 350,
    overflowY: "auto",
    overflowX: "auto"
  }}
>
  <Table stickyHeader>
    <TableHead>
      <TableRow
        sx={{
          "& th": {
            backgroundColor: "#222",
            color: "#fff",
            fontWeight: "bold"
          }
        }}
      >
        <TableCell>Fecha</TableCell>
        <TableCell>SKU</TableCell>
        <TableCell>Producto</TableCell>
        <TableCell>Movimiento</TableCell>
        <TableCell>Cantidad</TableCell>
        <TableCell>Lote</TableCell>
        <TableCell>Referencia</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {filteredMovements.map(
        (movement) => (
          <TableRow
            key={movement.id}
          >
            <TableCell>
              {new Date(
                movement.occurredAt
              ).toLocaleString()}
            </TableCell>

            <TableCell>
              {
                itemLookup[
                  movement.itemId
                ]?.sku ?? "-"
              }
            </TableCell>

            <TableCell>
              {
                itemLookup[
                  movement.itemId
                ]?.name ?? "-"
              }
            </TableCell>

            <TableCell>
              <Chip
                size="small"
                label={
                  movementTypes[
                    movement.movementType
                  ]
                }
                color={
                  movement.movementType === 0
                    ? "success"   // Entrada
                    : movement.movementType === 4
                    ? "error"     // Salida
                    : movement.movementType === 2
                    ? "info"      // Traspaso
                    : movement.movementType === 6
                    ? "warning"   // Embarque
                    : "default"
                }
              />
            </TableCell>

            <TableCell
              sx={{
                fontWeight: "bold",
                color:
                  movement.movementType === 0
                    ? "#4caf50"
                    : movement.movementType === 4
                    ? "#f44336"
                    : undefined
              }}
            >
              {movement.movementType === 0
                ? `+${movement.quantity}`
                : movement.movementType === 4
                ? `-${movement.quantity}`
                : movement.quantity}
            </TableCell>

            <TableCell>
              {movement.lotNumber ??
                "-"}
            </TableCell>

            <TableCell>
              {referenceLabels[
                movement.referenceType
              ] ??
                movement.referenceType ??
                "-"}
            </TableCell>
          </TableRow>
        )
      )}
    </TableBody>
  </Table>
</Box>
</Paper>
<Paper
  sx={{
    p: 2,
    mb: 3,
    display: "flex",
    gap: 4,
    flexWrap: "wrap"
  }}
>
  <Typography>
    📥 Entradas:{" "}
    <strong>
      {totalEntradas}
    </strong>
  </Typography>

  <Typography>
    📤 Salidas:{" "}
    <strong>
      {totalSalidas}
    </strong>
  </Typography>

  <Typography>
    📦 Saldo Actual:{" "}
    <strong>
      {saldoActual}
    </strong>
  </Typography>
</Paper>
<Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Cantidad Esperada</TableCell>
              <TableCell>Cantidad RFID</TableCell>
              <TableCell>Diferencia</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                sx={{
                  backgroundColor:
                    ((rfidQuantities[item.id] ?? 0) -
                    (quantities[item.id] ?? 0))
                      !== 0
                      ? "rgba(244,67,54,0.08)"
                      : undefined
                }}
              >
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
  open={sessionDetailOpen}
  onClose={() =>
    setSessionDetailOpen(false)
  }
>
  <DialogTitle>
    Detalle del Conteo
  </DialogTitle>

  <DialogContent>
    <Typography>
      Precisión:
      {" "}
      {selectedSession?.accuracy}%
    </Typography>

    <Typography>
      Diferencias:
      {" "}
      {selectedSession?.varianceItems}
    </Typography>
    
    <Typography>
      Coincidentes:
      {" "}
      {selectedSession?.matchedItems}
    </Typography>

    <Typography>
      Faltantes:
      {" "}
      {selectedSession?.missingItems}
    </Typography>

<Table sx={{ mt: 2 }}>
  <TableHead>
    <TableRow>
      <TableCell>SKU</TableCell>
      <TableCell>Nombre</TableCell>
      <TableCell>Esperado</TableCell>
      <TableCell>RFID</TableCell>
      <TableCell>Diferencia</TableCell>
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
      Cerrar
    </Button>
  </DialogActions>
</Dialog>

<Dialog
  open={movementOpen}
  onClose={() =>
    setMovementOpen(false)
  }
>
  <DialogTitle>
    Nuevo Movimiento
  </DialogTitle>

  <DialogContent>

    <TextField
      select
      fullWidth
      margin="dense"
      label="Movimiento"
      value={
        newMovement.movementType
      }
      onChange={(e) =>
        setNewMovement({
          ...newMovement,
          movementType:
            Number(
              e.target.value
            )
        })
      }
      SelectProps={{
        native: true
      }}
    >
      <option value={0}>
        Entrada
      </option>

      <option value={4}>
        Salida
      </option>

      <option value={2}>
        Traspaso
      </option>

      <option value={3}>
        Ajuste
      </option>
    </TextField>

    <TextField
      select
      fullWidth
      margin="dense"
      label="Producto"
      value={
        newMovement.itemId
      }
      onChange={(e) =>
        setNewMovement({
          ...newMovement,
          itemId: e.target.value
        })
      }
      SelectProps={{
        native: true
      }}
    >
      <option value="">
        Seleccione producto
      </option>

      {items.map((item) => (
        <option
          key={item.id}
          value={item.id}
        >
          {item.sku} - {item.name}
        </option>
      ))}
    </TextField>

    <TextField
      select
      fullWidth
      margin="dense"
      label="Ubicación"
      value={
        newMovement.locationId
      }
      onChange={(e) =>
        setNewMovement({
          ...newMovement,
          locationId:
            e.target.value
        })
      }
      SelectProps={{
        native: true
      }}
    >
      <option value="">
        Seleccione ubicación
      </option>

      {locations.map(
        (location) => (
          <option
            key={location.id}
            value={location.id}
          >
            {location.name}
          </option>
        )
      )}
    </TextField>

    <TextField
      fullWidth
      margin="dense"
      label="Cantidad"
      type="number"
      value={
        newMovement.quantity
      }
      onChange={(e) =>
        setNewMovement({
          ...newMovement,
          quantity:
            Number(
              e.target.value
            )
        })
      }
    />

    <TextField
      fullWidth
      margin="dense"
      label="Lote"
      value={
        newMovement.lotNumber
      }
      onChange={(e) =>
        setNewMovement({
          ...newMovement,
          lotNumber:
            e.target.value
        })
      }
    />

    <TextField
      fullWidth
      margin="dense"
      label="Referencia"
      value={
        newMovement.referenceType
      }
      onChange={(e) =>
        setNewMovement({
          ...newMovement,
          referenceType:
            e.target.value
        })
      }
    />

  </DialogContent>

  <DialogActions>

    <Button
      onClick={() => {

        setMovementOpen(false);

        setNewMovement({
          movementType: 0,
          itemId: "",
          quantity: 1,
          lotNumber: "",
          referenceType: "",
          locationId: ""
        });

      }}
    >
      Cancelar
    </Button>

    <Button
      variant="contained"
      onClick={
        createMovement
      }
    >
      Guardar
    </Button>

  </DialogActions>
</Dialog>
    </div>
  );
}