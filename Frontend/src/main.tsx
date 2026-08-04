import React from "react";
import ReactDOM from "react-dom/client";

import {
  ThemeProvider,
} from "@mui/material/styles";

import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";

import {
  darkTheme,
  lightTheme,
} from "./theme";

const savedTheme =
  localStorage.getItem(
    "rfidflow-theme"
  ) ?? "dark";

const selectedTheme =
  savedTheme === "light"
    ? lightTheme
    : darkTheme;

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <ThemeProvider
      theme={selectedTheme}
    >
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);