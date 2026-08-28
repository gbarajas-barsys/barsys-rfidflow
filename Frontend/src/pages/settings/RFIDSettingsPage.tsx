import { useEffect, useState } from "react";

import {
  getLocations,
} from "../../services/locationService";

import {
  mockReaders,
} from "../../data/mockReaders";

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
  Box,
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
            readerId: 1,
            name: "Receiving Gate",
            enabled: true,
            power: 30,
            location: "Almacén Principal MX",
            zone: "Embarques",
          },
          {
            id: 2,
            readerId: 1,
            name: "Rack A",
            enabled: true,
            power: 25,
            location: "Almacén Principal MX",
            zone: "Alambrado",
          },
          {
            id: 3,
            readerId: 2,
            name: "Antenna 3",
            enabled: false,
            power: 20,
            location: "",
            zone: "",
          },
          {
            id: 4,
            readerId: 2,
            name: "Antenna 4",
            enabled: false,
            power: 20,
            location: "",
            zone: "",
          },
        ];
  });

  const [messageType, setMessageType] =
    useState<
      "success" | "error"
    >("success");

  const [locations, setLocations] =
  useState<any[]>([]);

  const [readers, setReaders] =
  useState(() => {

    const saved =
      localStorage.getItem(
        "rfid-readers"
      );

    return saved
      ? JSON.parse(saved)
      : mockReaders;

  });

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

    localStorage.setItem(
      "rfid-readers",
      JSON.stringify(
        readers
      )
    );

  }, [readers]);

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

<Divider sx={{ my: 6 }} />

<Box
  sx={{
    textAlign: "center",
    mb: 2,
  }}
>

  <Typography
    variant="h5"
    fontWeight="bold"
  >
    Reader Inventory
  </Typography>

  <Typography
    variant="body2"
    color="text.secondary"
    sx={{ mt: 1 }}
  >
    Manage RFID readers and antenna assignments
  </Typography>

</Box>

<Divider sx={{ mb: 3 }} />

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

<Grid container spacing={2}>
  {readers.map(
    (reader) => {

      const assignedAntennas =
        antennas.filter(
          (a) =>
            a.readerId ===
            reader.id
        ).length;
      
        const assignedAntennaList =
          antennas.filter(
            (a) =>
              a.readerId ===
              reader.id
          );

      return (
        <Grid
          item
          xs={12}
          md={6}
          key={reader.id}
        >
          <Paper
            sx={{ p: 2 }}
          >
            <Typography
              variant="h6"
            >
              📡 {reader.name}
            </Typography>

            <TextField
              fullWidth
              size="small"
              label="Reader Name"
              sx={{ mt: 2 }}
              value={reader.name}
              onChange={(e) =>
                setReaders(
                  readers.map((r) =>
                    r.id === reader.id
                      ? {
                          ...r,
                          name:
                            e.target.value,
                        }
                      : r
                  )
                )
              }
            />

            <TextField
              fullWidth
              size="small"
              label="IP Address"
              sx={{ mt: 2 }}
              value={
                reader.ipAddress
              }
              onChange={(e) =>
                setReaders(
                  readers.map((r) =>
                    r.id === reader.id
                      ? {
                          ...r,
                          ipAddress:
                            e.target.value,
                        }
                      : r
                  )
                )
              }
            />

            <TextField
              fullWidth
              size="small"
              label="Model"
              sx={{ mt: 2 }}
              value={reader.model}
              onChange={(e) =>
                setReaders(
                  readers.map((r) =>
                    r.id === reader.id
                      ? {
                          ...r,
                          model:
                            e.target.value,
                        }
                      : r
                  )
                )
              }
            />

            <Button
              color="error"
              variant="outlined"
              size="small"
              sx={{ mt: 2 }}
              onClick={() => {

                const assignedAntennas =
                  antennas.filter(
                    (a) =>
                      a.readerId ===
                      reader.id
                  );

                if (
                  assignedAntennas.length > 0
                ) {

                  setMessageType(
                    "error"
                  );

                  setMessage(
                    "Cannot delete reader with assigned antennas."
                  );

                  return;
                }

                setReaders(
                  readers.filter(
                    (r) =>
                      r.id !==
                      reader.id
                  )
                );

                setMessageType(
                  "success"
                );

                setMessage(
                  "Reader deleted successfully."
                );

              }}
            >
              🗑 Delete Reader
            </Button>

            <Typography>
              Model:
              {" "}
              {reader.model}
            </Typography>

            <Typography>
              IP:
              {" "}
              {reader.ipAddress}
            </Typography>

            <Typography>
              Antennas:
              {" "}
              {assignedAntennas}
            </Typography>
            
            <Typography
              sx={{ mt: 1 }}
              fontWeight="bold"
            >
              Assigned Antennas
            </Typography>

            {assignedAntennaList.length >
            0 ? (

              assignedAntennaList.map(
                (antenna) => (

                  <Typography
                    key={
                      antenna.id
                    }
                    variant="body2"
                  >
                    • {antenna.name}
                  </Typography>

                )
              )

            ) : (

              <Typography
                variant="body2"
                color="text.secondary"
              >
                No antennas assigned
              </Typography>

            )}

            <Typography
              color={
                reader.status ===
                "online"
                  ? "success.main"
                  : "error.main"
              }
            >
              {
                reader.status ===
                "online"
                  ? "🟢 Online"
                  : "🔴 Offline"
              }
            </Typography>

          </Paper>
        </Grid>
      );
    }
  )}
</Grid>

<Divider sx={{ my: 4 }} />

<Button
  variant="contained"
  sx={{ mb: 2 }}
  onClick={() =>
    setReaders([
      ...readers,

      {
        id: Date.now(),

        name:
          `Reader ${
            readers.length + 1
          }`,

        model:
          "Impinj R700",

        ipAddress:
          "192.168.1.200",

        status:
          "offline",
      },
    ])
  }
>
  ➕ Add Reader
</Button>

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
        select
        fullWidth
        label="Reader"
        value={antenna.readerId ?? 1}
        sx={{ mb: 2 }}
        onChange={(e) =>
          setAntennas(
            antennas.map((a) =>
              a.id === antenna.id
                ? {
                    ...a,
                    readerId: Number(
                      e.target.value
                    ),
                  }
                : a
            )
          )
        }
      >
        {readers.map(
          (reader) => (
            <MenuItem
              key={reader.id}
              value={reader.id}
            >
              {reader.name}
            </MenuItem>
          )
        )}
      </TextField>

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
      <TextField
        fullWidth
        label="Zone"
        sx={{ mt: 2 }}
        value={antenna.zone ?? ""}
        onChange={(e) =>
          setAntennas(
            antennas.map((a) =>
              a.id === antenna.id
                ? {
                    ...a,
                    zone: e.target.value,
                  }
                : a
            )
          )
        }
      />
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
        
      </Grid>
    </Paper>
  );
}