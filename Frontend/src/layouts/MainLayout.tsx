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
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import BusinessIcon from "@mui/icons-material/Business";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import AssignmentIcon from "@mui/icons-material/Assignment";

import { Link, Outlet } from "react-router-dom";

const drawerWidth = 240;

export default function MainLayout() {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">
            📡 Barsys RFIDFlow
          </Typography>
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

        <List>
          <ListItemButton component={Link} to="/">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton component={Link} to="/inventory">
            <ListItemIcon>
              <InventoryIcon />
            </ListItemIcon>
            <ListItemText primary="Inventario" />
          </ListItemButton>

          <ListItemButton component={Link} to="/assets">
            <ListItemIcon>
              <BusinessIcon />
            </ListItemIcon>
            <ListItemText primary="Assets" />
          </ListItemButton>

          <ListItemButton component={Link} to="/rfid">
            <ListItemIcon>
              <RssFeedIcon />
            </ListItemIcon>
            <ListItemText primary="RFID" />
          </ListItemButton>

          <ListItemButton component={Link} to="/work-orders">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Work Orders" />
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