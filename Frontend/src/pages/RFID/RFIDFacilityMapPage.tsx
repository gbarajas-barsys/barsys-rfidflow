import {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import layout from "../../assets/abb-layout.png";

export default function RFIDFacilityMapPage() {

  const [antennas, setAntennas] =
  useState(() => {
    const saved =
      localStorage.getItem(
        "rfid-map-antennas"
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

    const [draggingId, setDraggingId] =
        useState<number | null>(
            null
        );

  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
      >
        RFID Facility Map
      </Typography>

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
              boxShadow: 3,
              transform: "translate(-50%, -50%)", // Centra el marcador exactamente sobre la coordenada (x, y)
              whiteSpace: "nowrap",
              zIndex: 10,
            }}
          >
            📡 {antenna.name}

            <br />

            {antenna.count}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}