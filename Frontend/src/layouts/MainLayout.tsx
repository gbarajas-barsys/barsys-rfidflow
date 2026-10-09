import {
  hasPermission
} from "../security/permissionService";

import {
  getAllTenants
} from "../services/tenantService";

import {
  useState,
  useEffect
} from "react";

import {
  useTenant
} from "../context/TenantContext";

import {
  canUseAssets,
  canUseInventory,
  canUseRfid
} from "../security/planAccessService";

import {
  getReentrySummary
} from "../services/dashboardService";


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
  FormControl,
  Select,
  MenuItem
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
import PersonIcon from "@mui/icons-material/Person";


import { Link, Outlet } from "react-router-dom";

import logoBp from "../assets/logob.png";

const drawerWidth = 240;

export default function MainLayout() {
  const currentDate =
    new Date().toLocaleDateString();

    console.log(
    "LOCAL STORAGE TENANT",
    localStorage.getItem(
      "selectedTenantId"
    )
  );
  const {tenant, setTenant} = useTenant();
  console.log(
  "TENANT",
  tenant?.name,
  tenant?.plan
);
  
  const authenticatedUser = JSON.parse(
    localStorage.getItem("currentUser") ?? "{}"
    );

  const [tenants, setTenants] =
    useState<any[]>([]);
  
  const [pendingReentries,
    setPendingReentries] =
      useState(0);

  const [selectedTenantId,
    setSelectedTenantId] =
      useState(
        localStorage.getItem(
          "selectedTenantId"
        ) ??
        authenticatedUser.tenantId
      );

const permissions =
  authenticatedUser.permissions ?? [];

  useEffect(() => {

  const loadTenants =
    async () => {

      if (
        !authenticatedUser.roles?.includes(
          "SUPER_ADMIN"
        )
      ) {
        return;
      }

      const data =
        await getAllTenants();

      setTenants(data);

    };

  const loadSummary =
    async () => {

      try {

        const data =
          await getReentrySummary();

        setPendingReentries(
          data.pendingReentries
        );

      }
      catch (error) {

        console.error(
          "Error loading reentry summary",
          error
        );

      }
    };

  loadTenants();
  loadSummary();

}, []);

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

            {
              hasPermission(
                permissions,
                "rfid.read"
              ) && (
                <Chip
                  label={`⚠️ Reingresos Pendientes: ${pendingReentries}`}
                  color={
                    pendingReentries > 0
                      ? "error"
                      : "success"
                  }
                  size="small"
                />
              )
            }

            {
              authenticatedUser.roles?.includes(
                "SUPER_ADMIN"
              ) && (

                <FormControl
                  size="small"
                  sx={{
                    minWidth: 180
                  }}
                >

                  <Select

                    value={
                      selectedTenantId
                    }

                    onChange={(e) => {

                      const tenantId =
                        e.target.value;

                      const selectedTenant =
                        tenants.find(
                          t => t.id === tenantId
                        );

                      setSelectedTenantId(
                        tenantId
                      );

                      setTenant({
                        id: selectedTenant?.id ?? "",
                        name: selectedTenant?.name ?? "",
                        code: selectedTenant?.code,
                        plan: selectedTenant?.plan,
                        country: selectedTenant?.country,
                        timezone: selectedTenant?.timezone
                      });

                      localStorage.setItem(
                        "selectedTenantId",
                        tenantId
                      );

                      // window.location.reload();
                    }}
                  >

                    {
                      tenants.map(
                        tenant => (

                          <MenuItem
                            key={tenant.id}
                            value={tenant.id}
                          >
                            {tenant.name}
                          </MenuItem>

                        )
                      )
                    }

                  </Select>

                </FormControl>

              )
            }

            <Stack
              direction="column"
              spacing={0}
            >
              <Chip
                label={
                  authenticatedUser.displayName ??
                  "Unknown User"
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

  {
  canUseRfid(
    tenant?.plan
  ) &&
  hasPermission(
    permissions,
    "rfid.read"
  ) && (
    <ListItemButton
  component={Link}
  to="/traceability"
>
  <ListItemIcon>
    <VisibilityIcon.default />
  </ListItemIcon>

  <ListItemText
    primary="Trazabilidad"
  />
</ListItemButton>
  )
}

  {
    canUseInventory(
      tenant?.plan
    ) &&
    hasPermission(
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

  {
  canUseInventory(
    tenant?.plan
  ) &&
  hasPermission(
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

  {
    canUseAssets(
      tenant?.plan
    ) &&
    hasPermission(
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

  {
  canUseAssets(
    tenant?.plan
  ) &&
  hasPermission(
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

  {
  canUseInventory(
    tenant?.plan
  ) &&
  hasPermission(
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

  {authenticatedUser.roles?.includes(
  "SUPER_ADMIN"
) && (
  <ListItemButton component={Link} to="/settings/roles">
    <ListItemIcon>
      <SettingsIcon.default />
    </ListItemIcon>
    <ListItemText primary="Roles & Permissions" />
  </ListItemButton>
  )}

  {authenticatedUser.roles?.includes(
  "SUPER_ADMIN"
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

  {hasPermission(
  permissions,
  "audit.read"
  ) && (
    <ListItemButton
      component={Link}
      to="/settings/audit-logs"
    >
      <ListItemIcon>
        <AssessmentIcon.default />
      </ListItemIcon>

      <ListItemText
        primary="Audit Logs"
      />
    </ListItemButton>
  )}

  <ListItemButton
    component={Link}
    to="/profile"
  >
    <ListItemIcon>
      <PersonIcon.default />
    </ListItemIcon>

    <ListItemText
      primary="My Profile"
    />
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