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
  
  const activeAntennas =
  antennas.filter(
    (a) => a.enabled
  ).length;

const disabledAntennas =
  antennas.filter(
    (a) => !a.enabled
  ).length;

const assignedLocations =
  antennas.filter(
    (a) => a.location
  ).length;

const averagePower =
  antennas.length > 0
    ? Math.round(
        antennas.reduce(
          (sum, antenna) =>
            sum + antenna.power,
          0
        ) / antennas.length
      )
    : 0;

const mostPowerfulAntenna =
  antennas.length > 0
    ? antennas.reduce(
        (max, antenna) =>
          antenna.power > max.power
            ? antenna
            : max,
        antennas[0]
      )
    : null;

const antennasNeedingAttention =
  antennas.filter(
    (a) =>
      !a.enabled ||
      a.power < 20
  ).length;

const coverageHealth =
  activeAntennas > 0
    ? Math.round(
        (activeAntennas /
          antennas.length) *
          100
      )
    : 0;


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
<Divider sx={{ my: 4 }} />

<Typography
  variant="h5"
  gutterBottom
>
  Coverage Summary
</Typography>

<Grid container spacing={2}>
<Grid item xs={12} md={3}>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6">
      💚 Health
    </Typography>

    <Typography
      variant="h4"
      color={
        coverageHealth >= 75
          ? "success.main"
          : coverageHealth >= 50
          ? "warning.main"
          : "error.main"
      }
    >
      {coverageHealth}%
    </Typography>
  </Paper>
</Grid>

  <Grid item xs={12} md={3}>
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">
        📡 Antenas Activas
      </Typography>

      <Typography variant="h4">
        {activeAntennas}
      </Typography>
    </Paper>
  </Grid>

  <Grid item xs={12} md={3}>
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">
        📡 Antenas Inactivas
      </Typography>

      <Typography variant="h4">
        {disabledAntennas}
      </Typography>
    </Paper>
  </Grid>
  
  <Grid item xs={12} md={3}>
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">
        ⚠ Attention
      </Typography>

      <Typography variant="h4">
        {antennasNeedingAttention}
      </Typography>
    </Paper>
  </Grid>
  
  <Grid item xs={12} md={3}>
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">
        📍 Locations
      </Typography>

      <Typography variant="h4">
        {assignedLocations}
      </Typography>
    </Paper>
  </Grid>

  <Grid item xs={12} md={3}>
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">
        ⚡ Avg dBm
      </Typography>

      <Typography variant="h4">
        {averagePower}
      </Typography>
    </Paper>
  </Grid>

  <Grid item xs={12} md={3}>
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6">
        🔥 Strongest
      </Typography>

      <Typography variant="body1">
        {mostPowerfulAntenna?.name ??
          "--"}
      </Typography>

      <Typography variant="h5">
        {mostPowerfulAntenna?.power ??
          "--"} dBm
      </Typography>
    </Paper>
  </Grid>

  
</Grid>

<Divider sx={{ my: 4 }} />

<Typography
  variant="h5"
  gutterBottom
>
  Coverage Map
</Typography>

<Grid
  container
  spacing={2}
>
  {antennas.map(
    (antenna) => (
      <Grid
        item
        xs={12}
        md={6}
        key={`coverage-${antenna.id}`}
      >
        <Paper
          sx={{
            p: 2,
          }}
        >
          <Typography
            variant="h6"
          >
            📡 {antenna.name}
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 1 }}
          >
            📍 {antenna.location ||
              "No location assigned"}
          </Typography>

          <Typography
            variant="body2"
            sx={{ mt: 1 }}
          >
            ⚡ {antenna.power} dBm
          </Typography>

          <Typography
            sx={{ mt: 1 }}
            color={
              antenna.enabled
                ? "success.main"
                : "error.main"
            }
          >
            {antenna.enabled
              ? "🟢 Enabled"
              : "🔴 Disabled"}
          </Typography>

          <Typography
            sx={{ mt: 1 }}
            color={
              antenna.power >= 25
                ? "success.main"
                : antenna.power >= 20
                ? "warning.main"
                : "error.main"
            }
          >
            {antenna.power >= 25
              ? "🟢 Excellent Coverage"
              : antenna.power >= 20
              ? "🟡 Moderate Coverage"
              : "🔴 Weak Coverage"}
          </Typography>
        </Paper>
      </Grid>
    )
  )}
</Grid>

<Divider sx={{ my: 4 }} />

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

<Divider sx={{ my: 5 }} />

<Grid item xs={12}>
  <Typography
    variant="h5"
    gutterBottom
  >
    Antenna Configuration
  </Typography>

  </Grid>
<Grid
  container
  spacing={3}
>
{antennas.map(
  (antenna) => (
    <Grid
  item
  xs={12}
  md={6}
  key={antenna.id}
>
  <Paper
    sx={{
      p: 2,
      height: "100%",
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
  </Grid>
)
)}
</Grid>
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