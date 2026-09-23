import { useEffect, useState } from "react";
import {
  hasPermission
} from "../security/permissionService";

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
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PrintIcon from "@mui/icons-material/Print";



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
  
    const [currentUser, setCurrentUser] =
  useState<User | null>(null);
  const authenticatedUser = JSON.parse(
  localStorage.getItem("currentUser") ?? "{}"
  );

  
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
  
const permissions =
  authenticatedUser.permissions ?? [];

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
  
  {hasPermission(
  permissions,
  "dashboard.read"
) && (
  <ListItemButton component={Link} to="/">
    <ListItemIcon>
      <DashboardIcon.default.default />
    </ListItemIcon>
    <ListItemText primary="Dashboard" />
  </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "inventory.read"
) && (
  <ListItemButton component={Link} to="/inventory">
    <ListItemIcon>
      <InventoryIcon.default />
    </ListItemIcon>
    <ListItemText primary="Inventario" />
  </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "products.read"
) && (
  <ListItemButton component={Link} to="/products">
    <ListItemIcon>
      <CategoryIcon.default />
    </ListItemIcon>
    <ListItemText primary="Products" />
  </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "assets.read"
) && (
  <ListItemButton component={Link} to="/assets">
    <ListItemIcon>
      <BusinessIcon.default />
    </ListItemIcon>
    <ListItemText primary="Assets" />
  </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "assetpresence.read"
) && (
  <ListItemButton component={Link} to="/asset-presence">
    <ListItemIcon>
      <VisibilityIcon.default />
    </ListItemIcon>
    <ListItemText primary="Asset Presence" />
  </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "locations.read"
) && (
  <ListItemButton component={Link} to="/locations">
    <ListItemIcon>
      <LocationOnIcon.default />
    </ListItemIcon>
    <ListItemText primary="Locations" />
  </ListItemButton>
  )}
  
  {hasPermission(
  permissions,
  "rfid.read"
) && (
    <ListItemButton
      component={Link}
      to="/rfid-center"
    >
      <ListItemIcon>
        <LocalOfferIcon.default />
      </ListItemIcon>

      <ListItemText
        primary="RFID Center"
      />
    </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "rfid.templates.read"
) && (

    <ListItemButton
      component={Link}
      to="/rfid-templates"
    >
      <ListItemIcon>
        <LocalOfferIcon.default />
      </ListItemIcon>

      <ListItemText
        primary="RFID Templates"
      />

    </ListItemButton>

  )}

  {hasPermission(
  permissions,
  "rfid.read"
) && (
  <ListItemButton component={Link} to="/rfid">
    <ListItemIcon>
      <RssFeedIcon.default />
    </ListItemIcon>
    <ListItemText primary="RFID Operations" />
  </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "rfid.live"
) && (
  <ListItemButton component={Link} to="/rfid-live">
    <ListItemIcon>
      <SensorsIcon.default />
    </ListItemIcon>
    <ListItemText primary="RFID Live" />
  </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "rfid.facilitymap.read"
) && (

    <ListItemButton
      component={Link}
      to="/rfid-facility-map"
    >
      <ListItemIcon>
        <LocationOnIcon.default />
      </ListItemIcon>

      <ListItemText
        primary="Facility Map"
      />
    </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "rfid.settings.read"
) && (
  <ListItemButton component={Link} to="/settings/rfid">
    <ListItemIcon>
      <SettingsIcon.default />
    </ListItemIcon>
    <ListItemText primary="RFID Settings" />
  </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "rfid.printers.read"
) && (

    <ListItemButton
      component={Link}
      to="/settings/rfid/printers"
    >
      <ListItemIcon>
        <PrintIcon.default />
      </ListItemIcon>

      <ListItemText
        primary="RFID Printers"
      />

    </ListItemButton>

  )}

  {hasPermission(
  permissions,
  "workorders.read"
) && (
  <ListItemButton component={Link} to="/work-orders">
    <ListItemIcon>
      <AssignmentIcon.default />
    </ListItemIcon>
    <ListItemText primary="Work Orders" />
  </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "reports.read"
) && (
  <ListItemButton component={Link} to="/reports">
    <ListItemIcon>
      <AssessmentIcon.default />
    </ListItemIcon>
    <ListItemText primary="Reports" />
  </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "rfid.settings.read"
) && (
  <ListItemButton
    component={Link}
    to="/settings"
  >
    <ListItemIcon>
      <SettingsIcon.default />
    </ListItemIcon>

    <ListItemText
      primary="Settings"
    />
  </ListItemButton>
)}

  {hasPermission(
  permissions,
  "roles.read"
) && (
  <ListItemButton component={Link} to="/settings/roles">
    <ListItemIcon>
      <SettingsIcon.default />
    </ListItemIcon>
    <ListItemText primary="Roles & Permissions" />
  </ListItemButton>
  )}

  {hasPermission(
  permissions,
  "companies.read"
) && (
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

  {hasPermission(
  permissions,
  "users.read"
) && (
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