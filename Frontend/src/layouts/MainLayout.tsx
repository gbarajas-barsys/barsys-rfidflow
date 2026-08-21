import { useEffect, useState } from "react";

import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Chip,
  Stack,
} from "@mui/material";

import * as DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import BusinessIcon from "@mui/icons-material/Business";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import SensorsIcon from "@mui/icons-material/Sensors";
import CategoryIcon from "@mui/icons-material/Category";
import VisibilityIcon from "@mui/icons-material/Visibility";


import { Link, Outlet } from "react-router-dom";

import logoBp from "../assets/logob.png";

const drawerWidth = 240;
type User = {
  id: string;
  email: string;
  displayName: string;
  status: number;
};

export default function MainLayout() {
  const currentDate =
    new Date().toLocaleDateString();
  
  // TODO: Reemplazar por login real y permisos desde backend
  const [currentUser, setCurrentUser] =
  useState<User | null>(null);
  const authenticatedUser = JSON.parse(
  localStorage.getItem("currentUser") ?? "{}"
  );

  const roleMap: Record<string, string> = {
    tenant_admin: "SUPER_ADMIN",
    company_admin: "COMPANY_ADMIN",
    operator: "OPERATOR",
    viewer: "VIEWER",
  };

  const currentRole =
  roleMap[
    authenticatedUser.roles?.[0]
  ] ?? "VIEWER";

  const handleLogout = async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("currentUser");

  window.location.href = "/login";
};

useEffect(() => {
  loadCurrentUser();
}, []);

const loadCurrentUser = async () => {
  try {
    const response = await fetch(
      "http://localhost:8080/v2/Users?page=1&pageSize=1"
    );

    const data = await response.json();

    if (data.length > 0) {
      setCurrentUser(data[0]);
    }
  } catch (error) {
    console.error(
      "Error loading current user",
      error
    );
  }
};
  
  const permissionsByRole = {
  SUPER_ADMIN: [
    "Dashboard",
    "Inventory",
    "Products",
    "Assets",
    "Asset Presence",
    "Locations",
    "RFID",
    "RFID Live",
    "RFID Settings",
    "Work Orders",
    "Reports",
    "Settings",
    "Roles",
    "Administration"
  ],

  COMPANY_ADMIN: [
    "Dashboard",
    "Inventory",
    "Products",
    "Assets",
    "Asset Presence",
    "Locations",
    "Reports",
    "Administration"
  ],

  OPERATOR: [
    "Dashboard",
    "Inventory",
    "Assets",
    "Asset Presence"
  ],

  VIEWER: [
    "Dashboard",
    "Asset Presence"
  ]
};

const permissions =
  permissionsByRole[currentRole];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Stack
  direction="row"
  spacing={2}
  alignItems="center"
>
  <Typography variant="h6">
    RFIDFlow Platform by BARSYS 
  </Typography>
</Stack>

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Typography variant="body2">
              {currentDate}
            </Typography>

            <Chip
              label="Backend Online"
              color="success"
              size="small"
            />

            <Chip
              label="PostgreSQL OK"
              color="success"
              size="small"
            />

            <Stack
              direction="column"
              spacing={0}
            >
              <Chip
                label={
                  currentUser?.displayName ??
                  "Loading..."
                }
                color="primary"
              />

              <Typography
                variant="caption"
                sx={{
                color: "#E0E0E0",
                textAlign: "center",
                }}
              >
                {authenticatedUser.roles?.[0]}
              </Typography>
            </Stack>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("currentUser");

                window.location.replace("/login");
              }}
            >
              Logout
            </button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
  variant="permanent"
  sx={{
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
    },
  }}
>
  <Toolbar />
  <Box
    sx={{
      textAlign: "center",
      pt: 0,
      pb: 0,
      px: 1,
      mt: -7,
    }}
  >
  <Box
    component="img"
    src={logoBp}
    alt="Logo BP"
    sx={{
      width: 180, // Ajusta el ancho a tu gusto
      height: 'auto',
      my: 0,      // Margen arriba y abajo
      mx: 'auto',  // Centra la imagen horizontalmente
      display: 'block'
    }}
  />
  </Box>
  <List>
  
  {permissions.includes("Dashboard") && (
  <ListItemButton component={Link} to="/">
    <ListItemIcon>
      <DashboardIcon.default.default />
    </ListItemIcon>
    <ListItemText primary="Dashboard" />
  </ListItemButton>
  )}

  {permissions.includes("Inventory") && (
  <ListItemButton component={Link} to="/inventory">
    <ListItemIcon>
      <InventoryIcon.default />
    </ListItemIcon>
    <ListItemText primary="Inventario" />
  </ListItemButton>
  )}

  {permissions.includes("Products") && (
  <ListItemButton component={Link} to="/products">
    <ListItemIcon>
      <CategoryIcon.default />
    </ListItemIcon>
    <ListItemText primary="Products" />
  </ListItemButton>
  )}

  {permissions.includes("Assets") && (
  <ListItemButton component={Link} to="/assets">
    <ListItemIcon>
      <BusinessIcon.default />
    </ListItemIcon>
    <ListItemText primary="Assets" />
  </ListItemButton>
  )}

  {permissions.includes("Asset Presence") && (
  <ListItemButton component={Link} to="/asset-presence">
    <ListItemIcon>
      <VisibilityIcon.default />
    </ListItemIcon>
    <ListItemText primary="Asset Presence" />
  </ListItemButton>
  )}

  {permissions.includes("Locations") && (
  <ListItemButton component={Link} to="/locations">
    <ListItemIcon>
      <LocationOnIcon.default />
    </ListItemIcon>
    <ListItemText primary="Locations" />
  </ListItemButton>
  )}

  {permissions.includes("RFID") && (
  <ListItemButton component={Link} to="/rfid">
    <ListItemIcon>
      <RssFeedIcon.default />
    </ListItemIcon>
    <ListItemText primary="RFID" />
  </ListItemButton>
  )}

  {permissions.includes("RFID Live") && (
  <ListItemButton component={Link} to="/rfid-live">
    <ListItemIcon>
      <SensorsIcon.default />
    </ListItemIcon>
    <ListItemText primary="RFID Live" />
  </ListItemButton>
  )}

  {permissions.includes("RFID Settings") && (
  <ListItemButton component={Link} to="/settings/rfid">
    <ListItemIcon>
      <SettingsIcon.default />
    </ListItemIcon>
    <ListItemText primary="RFID Settings" />
  </ListItemButton>
  )}

  {permissions.includes("Work Orders") && (
  <ListItemButton component={Link} to="/work-orders">
    <ListItemIcon>
      <AssignmentIcon.default />
    </ListItemIcon>
    <ListItemText primary="Work Orders" />
  </ListItemButton>
  )}

  {permissions.includes("Reports") && (
  <ListItemButton component={Link} to="/reports">
    <ListItemIcon>
      <AssessmentIcon.default />
    </ListItemIcon>
    <ListItemText primary="Reports" />
  </ListItemButton>
  )}

  {permissions.includes("Settings") && (
  <ListItemButton component={Link} to="/settings">
    <ListItemIcon>
      <SettingsIcon.default />
    </ListItemIcon>
    <ListItemText primary="Settings" />
  </ListItemButton>
  )}

  {permissions.includes("Roles") && (
  <ListItemButton component={Link} to="/settings/roles">
    <ListItemIcon>
      <SettingsIcon.default />
    </ListItemIcon>
    <ListItemText primary="Roles & Permissions" />
  </ListItemButton>
  )}

  {permissions.includes("Administration") && (
  <ListItemButton
    component={Link}
    to="/settings/companies"
  >
    <ListItemIcon>
      <BusinessIcon.default />
    </ListItemIcon>

    <ListItemText primary="Companies" />
  </ListItemButton>
  )}

  {permissions.includes("Administration") && (
  <ListItemButton
    component={Link}
    to="/settings/users"
  >
    <ListItemIcon>
      <BusinessIcon.default />
    </ListItemIcon>

    <ListItemText primary="Users" />
  </ListItemButton>
  )}

</List>
</Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}