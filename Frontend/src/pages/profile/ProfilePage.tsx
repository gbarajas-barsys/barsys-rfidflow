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
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Alert,
  Divider,
} from "@mui/material";

export default function ProfilePage() {
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
        "New password and confirmation password do not match."
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
          "Unable to update password."
        );

        return;
      }

      setSuccess(
        "Password updated successfully. You will be redirected to login."
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
        "Unexpected error."
      );

    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 3 }}
      >
        My Profile
      </Typography>

      <Stack spacing={2}>

        <TextField
          label="Display Name"
          value={
            currentUser.displayName ??
            ""
          }
          disabled
          fullWidth
        />

        <TextField
          label="Email"
          value={
            currentUser.email ??
            ""
          }
          disabled
          fullWidth
        />

        <TextField
          label="Role"
          value={
            currentUser.roles?.[0] ??
            ""
          }
          disabled
          fullWidth
        />

        <Divider />

        <Typography
          variant="h6"
        >
          Change Password
        </Typography>

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
          label="Current Password"
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
          label="New Password"
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
                ? "✓ Minimum 8 characters"
                : "✗ Minimum 8 characters"
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
                ? "✓ Passwords match"
                : "Waiting for confirmation"
            }
          </Typography>
        </Stack>

        <TextField
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          label="Confirm Password"
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
          onClick={changePassword}
          disabled={
            newPassword.length < 8 ||
            newPassword !== confirmPassword
          }
        >
          Update Password
        </Button>

      </Stack>
    </Paper>
  );
}