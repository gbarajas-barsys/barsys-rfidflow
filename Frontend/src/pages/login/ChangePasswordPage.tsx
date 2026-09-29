import { useState } from "react";
import VisibilityIcon
  from "@mui/icons-material/Visibility";

import VisibilityOffIcon
  from "@mui/icons-material/VisibilityOff";

import IconButton
  from "@mui/material/IconButton";

import InputAdornment
  from "@mui/material/InputAdornment";

import {
  Box,
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
} from "@mui/material";

export default function ChangePasswordPage() {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") ?? "{}"
  );

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showCurrentPassword,
    setShowCurrentPassword] =
        useState(false);

    const [showNewPassword,
    setShowNewPassword] =
        useState(false);

    const [showConfirmPassword,
    setShowConfirmPassword] =
        useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const changePassword = async () => {
    setError("");
    setSuccess("");

    if (
      newPassword !== confirmPassword
    ) {
      setError(
        "La nueva contraseña y la confirmación no coinciden."
      );

      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/v2/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email:
              currentUser.email,

            currentPassword,

            newPassword,

            confirmPassword,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ??
          "No fue posible actualizar la contraseña."
        );

        return;
      }

      setSuccess(
        "Contraseña actualizada correctamente. Será redirigido al inicio de sesión."
      );

      setTimeout(() => {

        localStorage.removeItem(
          "accessToken"
        );

        localStorage.removeItem(
          "refreshToken"
        );

        localStorage.removeItem(
          "currentUser"
        );

        window.location.replace(
          "/login"
        );

      }, 2000);

    } catch (error) {

      console.error(error);

      setError(
        "Ocurrió un error inesperado."
      );

    }
  };

  if (
    !currentUser.mustChangePassword
  ) {
    window.location.replace("/");

    return null;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #111827 100%)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          width: 520,
          maxWidth: "90%",
          borderRadius: 3,
        }}
      >
        <Stack spacing={3}>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
          >
            RFIDFlow • Seguridad de Acceso
          </Typography>

          <Typography
            variant="h4"
            textAlign="center"
            fontWeight="bold"
          >
            🔐 Cambio Obligatorio de Contraseña
          </Typography>

          <Alert severity="warning">
            Por seguridad es necesario cambiar su contraseña temporal antes de acceder a RFIDFlow.
          </Alert>

        {error && (
          <Alert
            severity="error"
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
          >
            {success}
          </Alert>
        )}

        <TextField
          type={
            showCurrentPassword
              ? "text"
              : "password"
          }
          label="Contraseña Actual"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(
              e.target.value
            )
          }
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
              >
                <IconButton
                  onClick={() =>
                    setShowCurrentPassword(
                      !showCurrentPassword
                    )
                  }
                >
                  {
                    showCurrentPassword
                      ? (
                        <VisibilityOffIcon.default />
                      )
                      : (
                        <VisibilityIcon.default />
                      )
                  }
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
            type={
            showNewPassword
              ? "text"
              : "password"
          }
          label="Nueva Contraseña"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(
              e.target.value
            )
          }
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
              >
                <IconButton
                  onClick={() =>
                    setShowNewPassword(
                      !showNewPassword
                    )
                  }
                >
                  {
                    showNewPassword
                      ? (
                        <VisibilityOffIcon.default />
                      )
                      : (
                        <VisibilityIcon.default />
                      )
                  }
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Stack spacing={0}>
          <Typography
            variant="caption"
            sx={{
              color:
                newPassword.length >= 8
                  ? "success.main"
                  : "error.main"
            }}
          >
            {
              newPassword.length >= 8
                ? "✓ Mínimo 8 caracteres"
                : "✗ Mínimo 8 caracteres"
            }
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color:
                newPassword === confirmPassword &&
                confirmPassword.length > 0
                  ? "success.main"
                  : "text.secondary"
            }}
          >
            {
              newPassword === confirmPassword &&
              confirmPassword.length > 0
                ? "✓ Las contraseñas coinciden"
                : "Esperando confirmación"
            }
          </Typography>
        </Stack>

        <TextField
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          label="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
              >
                <IconButton
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {
                    showConfirmPassword
                      ? (
                        <VisibilityOffIcon.default />
                      )
                      : (
                        <VisibilityIcon.default />
                      )
                  }
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={changePassword}
          disabled={
            newPassword.length < 8 ||
            newPassword !== confirmPassword
          }
        >
          Actualizar Contraseña
        </Button>
      </Stack>
    </Paper>
  </Box>
);
}