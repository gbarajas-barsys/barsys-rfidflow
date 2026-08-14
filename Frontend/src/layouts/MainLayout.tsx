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
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent">
  <Toolbar />

  <Box
    component="img"
    src={logoBp}
    alt="Logo BP"
    sx={{
      width: 140, // Ajusta el ancho a tu gusto
      height: 'auto',
      my: 2,      // Margen arriba y abajo
      mx: 'auto',  // Centra la imagen horizontalmente
      display: 'block'
    }}
  />

  <List>

  <ListItemButton component={Link} to="/">
    <ListItemIcon>
      <DashboardIcon.default.default />
    </ListItemIcon>
    <ListItemText primary="Dashboard" />
  </ListItemButton>

  <ListItemButton component={Link} to="/inventory">
    <ListItemIcon>
      <InventoryIcon.default />
    </ListItemIcon>
    <ListItemText primary="Inventario" />
  </ListItemButton>

  <ListItemButton component={Link} to="/products">
    <ListItemIcon>
      <CategoryIcon.default />
    </ListItemIcon>
    <ListItemText primary="Products" />
  </ListItemButton>

  <ListItemButton component={Link} to="/assets">
    <ListItemIcon>
      <BusinessIcon.default />
    </ListItemIcon>
    <ListItemText primary="Assets" />
  </ListItemButton>

  <ListItemButton component={Link} to="/asset-presence">
    <ListItemIcon>
  <VisibilityIcon.default />
</ListItemIcon>
    <ListItemText primary="Asset Presence" />
  </ListItemButton>

  <ListItemButton component={Link} to="/locations">
    <ListItemIcon>
  <LocationOnIcon.default />
</ListItemIcon>
    <ListItemText primary="Locations" />
  </ListItemButton>

  <ListItemButton component={Link} to="/rfid">
    <ListItemIcon>
  <RssFeedIcon.default />
</ListItemIcon>
    <ListItemText primary="RFID" />
  </ListItemButton>

  <ListItemButton component={Link} to="/rfid-live">
    <ListItemIcon>
  <SensorsIcon.default />
</ListItemIcon>
    <ListItemText primary="RFID Live" />
  </ListItemButton>

  <ListItemButton component={Link} to="/settings/rfid">
    <ListItemIcon>
  <SettingsIcon.default />
</ListItemIcon>
    <ListItemText primary="RFID Settings" />
  </ListItemButton>

  <ListItemButton component={Link} to="/work-orders">
    <ListItemIcon>
  <AssignmentIcon.default />
</ListItemIcon>
    <ListItemText primary="Work Orders" />
  </ListItemButton>

  <ListItemButton component={Link} to="/reports">
    <ListItemIcon>
  <AssessmentIcon.default />
</ListItemIcon>
    <ListItemText primary="Reports" />
  </ListItemButton>

  <ListItemButton component={Link} to="/settings">
    <ListItemIcon>
  <SettingsIcon.default />
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