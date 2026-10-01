import {
  useEffect,
  useState,
} from "react";

import {
  getReadEvents,
} from "../../services/rfidService";

import type {
  RFIDRead,
} from "../../models/RFIDRead";

import { useNavigate }
  from "react-router-dom";

import { api }
from "../../api/apiClient";

import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import layout from "../../assets/abb-layout.png";

export default function RFIDFacilityMapPage() {

  const [antennas, setAntennas] =
  useState(() => {
    const saved =
      localStorage.getItem(
        "rfid-map-antennas"
      );
    console.log(
        JSON.parse(saved ?? "[]")
    );
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Receiving Gate",
            x: 250,
            y: 180,
            count: 125,
            },
          {
            id: 2,
            name: "Rack A",
            x: 700,
            y: 350,
            count: 84,
            },
          {
            id: 3,
            name: "Antenna 3",
            x: 1000,
            y: 550,
            count: 0,
          },
          {
            id: 4,
            name: "Antenna 4",
            x: 1200,
            y: 650,
            count: 0,
          },
        ];
  });

  useEffect(() => {
    localStorage.setItem(
        "rfid-map-antennas",
        JSON.stringify(
        antennas
        )
    );
    }, [antennas]);

    useEffect(() => {

        getReadEvents()
            .then((data) => {

                console.log(
                "EVENTS FROM API",
                data
                );

                const mappedReads =
                    data.map((event: any) => ({
                        epc: event.epc,

                        timestamp:
                            event.lastSeenAt,

                        antennaId:
                            event.antennaId ?? 1,

                        antennaName:
                            "RFID Reader",

                        zone:
                            "Unknown",

                        movement:
                            "IN"
                    }));

                setReads(mappedReads);

            });

    }, []);
            
    const [draggingId, setDraggingId] =
        useState<number | null>(
            null
        );
    
    const [
        selectedAntennaId,
        setSelectedAntennaId,
        ] = useState<number | null>(
        null
        );
    
    const [reads, setReads] =
        useState<RFIDRead[]>([]);
    
    const [items, setItems] =
    useState<any[]>([]);

    const [movements, setMovements] =
    useState<any[]>([]);

    const [locations, setLocations] =
    useState<any[]>([]);

    const [
    areaDialogOpen,
    setAreaDialogOpen
    ] = useState(false);

    useEffect(() => {

        api
            .get(
            "/v2/Items?page=1&pageSize=100"
            )
            .then(x =>
            setItems(x.data)
            );

        api
            .get(
            "/v2/inventory/movements?page=1&pageSize=500"
            )
            .then(x =>
            setMovements(x.data)
            );

        api
            .get(
            "/v2/Locations?page=1&pageSize=100"
            )
            .then(x =>
            setLocations(x.data)
            );

        }, []);


    const selectedAntenna =
        antennas.find(
            (a) =>
            a.id ===
            selectedAntennaId
        );

    const configAntennas =
      JSON.parse(
        localStorage.getItem(
          "rfid-antennas"
        ) ?? "[]"
    );

    const antennaConfig =
        configAntennas.find(
            (a: any) =>
            a.id ===
            selectedAntennaId
        );

    const antennaReads =
        selectedAntenna
            ? [...reads]
                .sort(
                    (a: any, b: any) =>
                        new Date(b.timestamp)
                            .getTime()
                        -
                        new Date(a.timestamp)
                            .getTime()
                )
                .slice(0, 5)
            : [];

    const uniqueTags =
        new Set(
            reads.map(
                read => read.epc
            )
        );

    const totalTags =
        uniqueTags.size;

    const entries =
        reads.filter(
            x => x.movement === "IN"
        ).length;

    const exits =
        reads.filter(
            x => x.movement === "OUT"
        ).length;

    const itemLookup =
    Object.fromEntries(
        items.map(item => [
        item.id,
        item
        ])
    );

    const locationLookup =
    Object.fromEntries(
        locations.map(location => [
        location.id,
        location.name
        ])
    );

    const inventoryBalances:
    Record<
        string,
        {
        itemId: string;
        locationId: string;
        quantity: number;
        }
    > = {};

    movements.forEach((movement) => {

        // Entrada
        if (
            movement.movementType === 0 &&
            movement.toLocationId
        ) {

            const key =
            `${movement.itemId}_${movement.toLocationId}`;

            if (!inventoryBalances[key]) {
            inventoryBalances[key] = {
                itemId: movement.itemId,
                locationId: movement.toLocationId,
                quantity: 0
            };
            }

            inventoryBalances[key].quantity +=
            movement.quantity;
        }

        // Salida
        if (
            movement.movementType === 4 &&
            movement.fromLocationId
        ) {

            const key =
            `${movement.itemId}_${movement.fromLocationId}`;

            if (!inventoryBalances[key]) {
            inventoryBalances[key] = {
                itemId: movement.itemId,
                locationId: movement.fromLocationId,
                quantity: 0
            };
            }

            inventoryBalances[key].quantity -=
            movement.quantity;
        }

        // Traspaso
        if (
            movement.movementType === 2
        ) {

            if (movement.fromLocationId) {

            const originKey =
                `${movement.itemId}_${movement.fromLocationId}`;

            if (!inventoryBalances[originKey]) {
                inventoryBalances[originKey] = {
                itemId: movement.itemId,
                locationId: movement.fromLocationId,
                quantity: 0
                };
            }

            inventoryBalances[originKey].quantity -=
                movement.quantity;
            }

            if (movement.toLocationId) {

            const destKey =
                `${movement.itemId}_${movement.toLocationId}`;

            if (!inventoryBalances[destKey]) {
                inventoryBalances[destKey] = {
                itemId: movement.itemId,
                locationId: movement.toLocationId,
                quantity: 0
                };
            }

            inventoryBalances[destKey].quantity +=
                movement.quantity;
            }
        }

        });

    const balanceRows =
    Object.values(
        inventoryBalances
    );

    const areaInventory =
    balanceRows.filter(
        (balance) =>
        locationLookup[
            balance.locationId
        ] ===
        antennaConfig?.zone
    );

    const areaTotal =
    areaInventory.reduce(
        (sum, item) =>
        sum + item.quantity,
        0
    );

    console.log(
    "AREA INVENTORY",
    antennaConfig?.zone,
    areaInventory
    );
    
    const navigate =
        useNavigate();

console.log(
  "CONFIG",
  configAntennas
);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
      >
        Velocity Motors Facility Map
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
            color: "#90caf9",
            mb: 0.5
        }}
        >
        90 Motocicletas en Inventario
        </Typography>

        <Typography
        variant="body2"
        sx={{
            color: "#bdbdbd",
            mb: 2
        }}
        >
        4 Zonas Monitoreadas
        </Typography>
      
      <Box
        sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
        }}
      >
    <Box sx={{ flex: 1 }}>
      <Box
        sx={{
            position: "relative",
            display: "inline-block",
        }}
        onMouseMove={(e) => {
            if (draggingId === null)
            return;

            const rect =
            e.currentTarget.getBoundingClientRect();

            const x =
            e.clientX -
            rect.left;

            const y =
            e.clientY -
            rect.top;

            setAntennas(
            antennas.map((a) =>
                a.id === draggingId
                ? {
                    ...a,
                    x,
                    y,
                    }
                : a
            )
            );
        }}
        onMouseUp={() =>
            setDraggingId(null)
        }
        >
        {/* Imagen del plano */}
        <Box
          component="img"
          src={layout}
          alt="ABB Layout"
          sx={{
            display: "block",
            maxWidth: "none", // Asegura que el scroll horizontal funcione si las coordenadas X rebasan la pantalla
          }}
        />

        {/* Marcadores de antenas */}
        {antennas.map((antenna) => (
          <Box
            key={antenna.id}
            onClick={() =>
                setSelectedAntennaId(
                antenna.id
                )
            }
            onMouseDown={() =>
                setDraggingId(
                antenna.id
                )
            }
            sx={{
                position: "absolute",
                left: antenna.x,
                top: antenna.y,
                cursor: "grab",
                userSelect: "none",
              bgcolor: "#1976d2",
              color: "white",
              borderRadius: 2,
              px: 1,
              py: 0.5,
              fontSize: 12,
              fontWeight: "bold",
              boxShadow:
                selectedAntennaId ===
                antenna.id
                    ? "0 0 20px #FFD700"
                    : 3,

                border:
                selectedAntennaId ===
                antenna.id
                    ? "2px solid #FFD700"
                    : "none",
              transform: "translate(-50%, -50%)", // Centra el marcador exactamente sobre la coordenada (x, y)
              whiteSpace: "nowrap",
              zIndex: 10,
            }}
          >
            📍 {
                configAntennas.find(
                    (a: any) =>
                    a.id === antenna.id
                )?.zone ??
                antenna.name
                }

            <br />

            <Box
            sx={{
                fontSize: 28,
                textAlign: "center"
            }}
            >
            🏍️
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
    <Paper
        sx={{
            width: 350,
            p: 2,
        }}
        >
        <Typography
            variant="h6"
            gutterBottom
        >
            Detalles de la Zona
        </Typography>

        {selectedAntenna ? (
            <>
            <Typography>
            📡 {antennaConfig?.zone}
            </Typography>
            
            <Typography>
            📍 Zona:
            {" "}
            {antennaConfig?.zone ??
            "Sin zona"}
            </Typography>
            
            <Typography>
            🏢 Ubicación:
            {" "}
            {antennaConfig?.location ??
            "Velocity Motors México"}
            </Typography>

            <Typography>
            🏍️ Motocicletas:
            {" "}
            {areaTotal}
            </Typography>

            <Typography
                sx={{ mt: 2 }}
                fontWeight="bold"
                >
                Actividad RFID
                </Typography>

                {antennaReads.map(
                    (read) => (
                        <Box
                        key={read.epc.substring(0, 16)}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                        >
                        <Typography
                            variant="body2"
                        >
                            {read.epc.substring(0, 16)}
                        </Typography>

                        <Box
                        sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                        }}
                        >
                        <Typography
                            variant="caption"
                            color="text.secondary"
                        >
                            {new Date(
                                read.timestamp
                            ).toLocaleString()}
                        </Typography>

                        <Typography>
                            {read.movement === "IN"
                            ? "📥"
                            : "📤"}
                        </Typography>
                        </Box>
                        </Box>
                    )
                    )}
                <Button
                    variant="contained"
                    fullWidth
                    sx={{
                        mt: 2,
                    }}
                    onClick={() =>
                    setAreaDialogOpen(true)
                    }
                >
                    Ver Detalles del Area
                </Button>
            </>
        ) : (
            <Typography>
            Select an antenna
            </Typography>
        )}
        </Paper>
    </Box>
    <Dialog
  open={areaDialogOpen}
  onClose={() =>
    setAreaDialogOpen(false)
  }
  maxWidth="md"
  fullWidth
>
  <DialogTitle>
    {antennaConfig?.zone}
  </DialogTitle>

  <DialogContent>

    <Table>

      <TableHead>
        <TableRow>

          <TableCell>
            SKU
          </TableCell>

          <TableCell>
            Producto
          </TableCell>

          <TableCell>
            Cantidad
          </TableCell>

        </TableRow>
      </TableHead>

      <TableBody>

        {areaInventory.map(
          (balance) => (

            <TableRow
              key={
                `${balance.itemId}-${balance.locationId}`
              }
            >

              <TableCell>
                {
                  itemLookup[
                    balance.itemId
                  ]?.sku ?? "-"
                }
              </TableCell>

              <TableCell>
                {
                  itemLookup[
                    balance.itemId
                  ]?.name ?? "-"
                }
              </TableCell>

              <TableCell>
                {balance.quantity}
              </TableCell>

            </TableRow>

          )
        )}

      </TableBody>

    </Table>

  </DialogContent>

</Dialog>
    </Paper>
  );
}