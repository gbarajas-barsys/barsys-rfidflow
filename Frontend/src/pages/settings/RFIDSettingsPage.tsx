import { useEffect, useState } from "react";

import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
} from "@mui/material";

export default function RFIDSettingsPage() {
  const [readerUrl, setReaderUrl] =
    useState("");

  const [pollInterval, setPollInterval] =
    useState("5000");

  const [message, setMessage] =
    useState("");

  const [messageType, setMessageType] =
    useState<
      "success" | "error"
    >("success");

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