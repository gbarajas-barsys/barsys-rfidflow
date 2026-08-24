import { useEffect, useState } from "react";
import {
  getLocations,
} from "../../services/locationService";

import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Switch,
  FormControlLabel,
  MenuItem,
} from "@mui/material";

export default function RFIDSettingsPage() {
  const [readerUrl, setReaderUrl] =
    useState("");

  const [pollInterval, setPollInterval] =
    useState("5000");

  const [message, setMessage] =
    useState("");
  
  const [antennas, setAntennas] =
  useState(() => {
    const saved =
      localStorage.getItem(
        "rfid-antennas"
      );

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Receiving Gate",
            enabled: true,
            power: 30,
            location:
              "Almacén Principal MX",
          },
          {
            id: 2,
            name: "Rack A",
            enabled: true,
            power: 25,
            location:
              "Almacén Principal MX",
          },
          {
            id: 3,
            name: "Antenna 3",
            enabled: false,
            power: 20,
            location: "",
          },
          {
            id: 4,
            name: "Antenna 4",
            enabled: false,
            power: 20,
            location: "",
          },
        ];
  });

  const [messageType, setMessageType] =
    useState<
      "success" | "error"
    >("success");

  const [locations, setLocations] =
  useState<any[]>([]);

  useEffect(() => {
    const savedReaderUrl =
      localStorage.getItem(
        "rfid-reader-url"
      ) ??
      "http://localhost:5120";

    const savedInterval =
      localStorage.getItem(
        "rfid-poll-interval"
      ) ?? "5000";

    setReaderUrl(
      savedReaderUrl
    );

    setPollInterval(
      savedInterval
    );
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "rfid-antennas",
      JSON.stringify(
        antennas
      )
    );
  }, [antennas]);

  useEffect(() => {
    const loadLocations =
      async () => {
        try {
          const data =
            await getLocations();

          setLocations(data);
        } catch (error) {
          console.error(
            "Error loading locations",
            error
          );
        }
      };

    loadLocations();
  }, []);

  const saveSettings =
    () => {
      localStorage.setItem(
        "rfid-reader-url",
        readerUrl
      );

      localStorage.setItem(
        "rfid-poll-interval",
        pollInterval
      );

      setMessageType(
        "success"
      );

      setMessage(
        "Configuración guardada correctamente."
      );
    };

  const testConnection =
    async () => {
      try {
        const response =
          await fetch(
            `${readerUrl}/api/reads`
          );

        if (
          response.ok
        ) {
          setMessageType(
            "success"
          );

          setMessage(
            "Conexión exitosa con RFIDFlow API."
          );
        } else {
          setMessageType(
            "error"
          );

          setMessage(
            "La API respondió con error."
          );
        }
      } catch {
        setMessageType(
          "error"
        );

        setMessage(
          "No fue posible conectar con la API."
        );
      }
    };

  return (
    <Paper
      sx={{
        p: 4,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
      >
        RFID Reader Settings
      </Typography>

      <Divider
        sx={{
          mb: 3,
        }}
      />

      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          xs={12}
        >
          <TextField
            fullWidth
            label="Reader URL"
            value={
              readerUrl
            }
            onChange={(
              e
            ) =>
              setReaderUrl(
                e.target
                  .value
              )
            }
          />
        </Grid>

        <Grid
          item
          xs={12}
        >
          <TextField
            fullWidth
            label="Poll Interval (ms)"
            value={
              pollInterval
            }
            onChange={(
              e
            ) =>
              setPollInterval(
                e.target
                  .value
              )
            }
          />
        </Grid>

        <Grid
          item
          xs={12}
        >
          <Button
            variant="contained"
            onClick={
              saveSettings
            }
            sx={{
              mr: 2,
            }}
          >
            Save
          </Button>

          <Button
            variant="outlined"
            onClick={
              testConnection
            }
          >
            Test Connection
          </Button>
        </Grid>
<Divider sx={{ my: 4 }} />

<Typography
  variant="h5"
  gutterBottom
>
  Antenna Configuration
</Typography>

{antennas.map(
  (antenna) => (
    <Paper
      key={antenna.id}
      sx={{
        p: 2,
        mb: 2,
      }}
    >
      <Typography
        variant="h6"
      >
        Antenna {antenna.id}
      </Typography>

      <TextField
        fullWidth
        label="Name"
        value={antenna.name}
        onChange={(e) =>
          setAntennas(
            antennas.map((a) =>
              a.id === antenna.id
                ? {
                    ...a,
                    name:
                      e.target.value,
                  }
                : a
            )
          )
        }
      />

      <TextField
        fullWidth
        label="Power (dBm)"
        sx={{ mt: 2 }}
        type="number"
        value={antenna.power}
        onChange={(e) =>
          setAntennas(
            antennas.map((a) =>
              a.id === antenna.id
                ? {
                    ...a,
                    power: Number(
                      e.target.value
                    ),
                  }
                : a
            )
          )
        }
      />

      <Typography
        variant="body2"
        color={
          antenna.power >= 25
            ? "success.main"
            : antenna.power >= 20
            ? "warning.main"
            : "error.main"
        }
        sx={{ mt: 1 }}
      >
        {antenna.power >= 25
          ? "🟢 Excellent Signal"
          : antenna.power >= 20
          ? "🟡 Medium Signal"
          : "🔴 Low Signal"}
      </Typography>

      <TextField
        select
        fullWidth
        label="Location"
        sx={{ mt: 2 }}
        value={antenna.location}
        onChange={(e) =>
          setAntennas(
            antennas.map((a) =>
              a.id === antenna.id
                ? {
                    ...a,
                    location:
                      e.target.value,
                  }
                : a
            )
          )
        }
      >
        {locations.map(
          (location) => (
            <MenuItem
              key={location.id}
              value={location.name}
            >
              {location.name}
            </MenuItem>
          )
        )}
      </TextField>

      <FormControlLabel
        sx={{ mt: 2 }}
        control={
          <Switch
            checked={antenna.enabled}
            onChange={(e) =>
              setAntennas(
                antennas.map((a) =>
                  a.id === antenna.id
                    ? {
                        ...a,
                        enabled:
                          e.target.checked,
                      }
                    : a
                )
              )
            }
          />
        }
        label={
          antenna.enabled
            ? "Enabled"
            : "Disabled"
        }
      />
    </Paper>
  )
)}
        {message && (
          <Grid
            item
            xs={12}
          >
            <Alert
              severity={
                messageType
              }
            >
              {message}
            </Alert>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}