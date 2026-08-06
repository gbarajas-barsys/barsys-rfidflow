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

import DashboardIcon from "@mui/icons-material/Dashboard";
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

import barsysLogo from "../assets/barsys-logo.png";

const drawerWidth = 240;

export default function MainLayout() {
  const currentDate =
    new Date().toLocaleDateString();

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
              RFIDFlow Platform
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
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
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
            p: 2,
          }}
        >
          
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
          >
            RFIDFlow Platform
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
          >
            Version 1.0.0
          </Typography>
        </Box>

        <List>
          <ListItemButton
            component={Link}
            to="/"
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton
  component={Link}
  to="/inventory"
>
  <ListItemIcon>
    <InventoryIcon />
  </ListItemIcon>

  <ListItemText primary="Inventario" />
</ListItemButton>

<ListItemButton
  component={Link}
  to="/products"
>
  <ListItemIcon>
    <CategoryIcon />
  </ListItemIcon>

  <ListItemText primary="Products" />
</ListItemButton>

<ListItemButton
  component={Link}
  to="/assets"
>
  <ListItemIcon>
    <BusinessIcon />
  </ListItemIcon>

  <ListItemText primary="Assets" />
</ListItemButton>

<ListItemButton
  component={Link}
  to="/asset-presence"
>
  <ListItemIcon>
    <VisibilityIcon />
  </ListItemIcon>

  <ListItemText primary="Asset Presence" />
</ListItemButton>

<ListItemButton
  component={Link}
  to="/locations"
>
  <ListItemIcon>
    <LocationOnIcon />
  </ListItemIcon>

  <ListItemText primary="Locations" />
</ListItemButton>

          <ListItemButton
            component={Link}
            to="/rfid"
          >
            <ListItemIcon>
              <RssFeedIcon />
            </ListItemIcon>
            <ListItemText primary="RFID" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/rfid-live"
          >
            <ListItemIcon>
              <SensorsIcon />
            </ListItemIcon>
            <ListItemText primary="RFID Live" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/work-orders"
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Work Orders" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/reports"
          >
            <ListItemIcon>
              <AssessmentIcon />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/settings"
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
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