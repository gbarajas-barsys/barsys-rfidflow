export const PERMISSIONS = {

  // Dashboard
  DASHBOARD_READ:
    "dashboard.read",

  // Inventory
  INVENTORY_READ:
    "inventory.read",

  INVENTORY_WRITE:
    "inventory.write",

  // Products
  PRODUCTS_READ:
    "products.read",

  PRODUCTS_WRITE:
    "products.write",

  // Assets
  ASSETS_READ:
    "assets.read",

  ASSETS_WRITE:
    "assets.write",

  // Asset Presence
  ASSET_PRESENCE_READ:
    "assetpresence.read",

  // Locations
  LOCATIONS_READ:
    "locations.read",

  LOCATIONS_WRITE:
    "locations.write",

  // RFID Center
  RFID_READ:
    "rfid.read",

  RFID_WRITE:
    "rfid.write",

  // RFID Live
  RFID_LIVE:
    "rfid.live",

  // RFID Templates
  RFID_TEMPLATES_READ:
    "rfid.templates.read",

  RFID_TEMPLATES_WRITE:
    "rfid.templates.write",

  // RFID Printers
  RFID_PRINTERS_READ:
    "rfid.printers.read",

  RFID_PRINTERS_WRITE:
    "rfid.printers.write",

  // RFID Settings
  RFID_SETTINGS_READ:
    "rfid.settings.read",

  RFID_SETTINGS_WRITE:
    "rfid.settings.write",

  // Facility Map
  RFID_FACILITYMAP_READ:
    "rfid.facilitymap.read",

  // Work Orders
  WORKORDERS_READ:
    "workorders.read",

  WORKORDERS_WRITE:
    "workorders.write",

  // Reports
  REPORTS_READ:
    "reports.read",

  REPORTS_EXPORT:
    "reports.export",

  // Users
  USERS_READ:
    "users.read",

  USERS_WRITE:
    "users.write",

  // Roles
  ROLES_READ:
    "roles.read",

  ROLES_WRITE:
    "roles.write",

  // Companies
  COMPANIES_READ:
    "companies.read",

  COMPANIES_WRITE:
    "companies.write"

} as const;

export const ALL_PERMISSIONS =
  Object.values(PERMISSIONS);

export const PERMISSION_LABELS = {

  "dashboard.read":
    "Dashboard",

  "inventory.read":
    "Inventory - View",

  "inventory.write":
    "Inventory - Edit",

  "products.read":
    "Products - View",

  "products.write":
    "Products - Edit",

  "assets.read":
    "Assets - View",

  "assets.write":
    "Assets - Edit",

  "assetpresence.read":
    "Asset Presence",

  "locations.read":
    "Locations - View",

  "locations.write":
    "Locations - Edit",

  "rfid.read":
    "RFID - View",

  "rfid.write":
    "RFID - Edit",

  "rfid.live":
    "RFID Live",

  "rfid.templates.read":
    "RFID Templates - View",

  "rfid.templates.write":
    "RFID Templates - Edit",

  "rfid.printers.read":
    "RFID Printers - View",

  "rfid.printers.write":
    "RFID Printers - Edit",

  "rfid.settings.read":
    "RFID Settings - View",

  "rfid.settings.write":
    "RFID Settings - Edit",

  "rfid.facilitymap.read":
    "Facility Map",

  "workorders.read":
    "Work Orders - View",

  "workorders.write":
    "Work Orders - Edit",

  "reports.read":
    "Reports - View",

  "reports.export":
    "Reports - Export",

  "users.read":
    "Users - View",

  "users.write":
    "Users - Edit",

  "roles.read":
    "Roles - View",

  "roles.write":
    "Roles - Edit",

  "companies.read":
    "Companies - View",

  "companies.write":
    "Companies - Edit",

} as const;

export const PERMISSION_GROUPS = {

  Dashboard: [
    "dashboard.read"
  ],

  Inventory: [
    "inventory.read",
    "inventory.write"
  ],

  Products: [
    "products.read",
    "products.write"
  ],

  Assets: [
    "assets.read",
    "assets.write"
  ],

  "Asset Presence": [
    "assetpresence.read"
  ],

  Locations: [
    "locations.read",
    "locations.write"
  ],

  RFID: [
    "rfid.read",
    "rfid.write",
    "rfid.live"
  ],

  "RFID Templates": [
    "rfid.templates.read",
    "rfid.templates.write"
  ],

  "RFID Printers": [
    "rfid.printers.read",
    "rfid.printers.write"
  ],

  "RFID Settings": [
    "rfid.settings.read",
    "rfid.settings.write"
  ],

  "Facility Map": [
    "rfid.facilitymap.read"
  ],

  "Work Orders": [
    "workorders.read",
    "workorders.write"
  ],

  Reports: [
    "reports.read",
    "reports.export"
  ],

  Users: [
    "users.read",
    "users.write"
  ],

  Roles: [
    "roles.read",
    "roles.write"
  ],

  Companies: [
    "companies.read",
    "companies.write"
  ]

} as const;
