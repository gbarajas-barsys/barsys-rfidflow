import {
  useEffect,
  useState,
} from "react";

import {
  getMockReads,
} from "../../services/rfidService";

import type {
  RFIDRead,
} from "../../models/RFIDRead";

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

        getMockReads()
            .then((reads) => {

            console.log(
                "RFID READS",
                reads
            );

            });

        }, []);

    useEffect(() => {

        getMockReads()
            .then((data) => {

            setReads(data);

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
    ? reads.filter(
        (read) =>
          read.antennaId ===
          selectedAntenna.id
      )
    : [];

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
        RFID Facility Map
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
            📡 {antenna.name}

            <br />

            📍 {
            configAntennas.find(
                (a: any) =>
                a.id === antenna.id
            )?.zone ?? ""
            }

            <br />

            📦 {antenna.count}
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
            Antenna Details
        </Typography>

        {selectedAntenna ? (
            <>
            <Typography>
            📡 {selectedAntenna.name}
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
                "Sin ubicación"}
            </Typography>

            <Typography>
            Tags:
            {" "}
            {selectedAntenna.count}
            </Typography>

            <Typography sx={{ mt: 1 }}>
            📥 Entradas: 87
            </Typography>

            <Typography>
            📤 Salidas: 38
            </Typography>

            <Typography
                sx={{ mt: 2 }}
                fontWeight="bold"
                >
                Últimas Lecturas
                </Typography>

                {antennaReads.map(
                    (read) => (
                        <Box
                        key={read.epc}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                        >
                        <Typography
                            variant="body2"
                        >
                            {read.epc}
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
                            {read.timestamp}
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
            </>
        ) : (
            <Typography>
            Select an antenna
            </Typography>
        )}
        </Paper>
    </Box>
    </Paper>
  );
}