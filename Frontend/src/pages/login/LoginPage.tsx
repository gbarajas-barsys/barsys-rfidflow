import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logoBp from "../../assets/logob.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantCode, setTenantCode] = useState("");

  const handleLogin = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/v2/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          tenantCode,
        }),
      }
    );

    if (!response.ok) {
      alert("Invalid credentials");
      return;
    }

    const data = await response.json();

    localStorage.setItem(
      "accessToken",
      data.accessToken
    );

    localStorage.setItem(
      "refreshToken",
      data.refreshToken
    );

    localStorage.setItem(
      "currentUser",
      JSON.stringify(data.user)
    );

    navigate("/");
  } catch (error) {
    console.error(error);
    alert("Login error");
  }
};

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
          width: 420,
          borderRadius: 3,
        }}
      >
        <Stack spacing={3}>
          <Box
            component="img"
            src={logoBp}
            alt="RFIDFlow"
            sx={{
              height: 100,
              objectFit: "contain",
              mx: "auto",
            }}
          />

          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="bold"
          >
            RFID Flow
          </Typography>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
          >
            Platform by BARSYS
          </Typography>

          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <TextField
            label="Tenant Code"
            fullWidth
            value={tenantCode}
            onChange={(e) =>
                setTenantCode(e.target.value)
            }
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleLogin}
          >
            Login
          </Button>

          <Typography
            variant="caption"
            textAlign="center"
            color="text.secondary"
        >
            RFID Asset Tracking Platform
            </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}