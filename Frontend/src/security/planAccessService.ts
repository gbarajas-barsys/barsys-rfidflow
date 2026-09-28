export const PLAN_MODULES: Record<
  string,
  string[]
> = {

  ACTIVOS: [
    "dashboard",

    "assets",
    "assetpresence",

    "locations",

    "rfid",
    "rfid-center",
    "rfid-templates",
    "rfid-live",
    "rfid-settings",
    "rfid-printers",

    "reports",
    "workorders",

    "settings",

    "users"
  ],

  INVENTARIO: [
    "dashboard",

    "inventory",
    "products",

    "locations",

    "rfid",
    "rfid-center",
    "rfid-templates",
    "rfid-live",
    "rfid-settings",
    "rfid-printers",
    "rfid-facility-map",

    "reports",
    "workorders",

    "settings",

    "users"
  ],

  RFIDFLOW_360: [
    "dashboard",

    "inventory",
    "products",

    "assets",
    "assetpresence",

    "locations",

    "rfid",
    "rfid-center",
    "rfid-templates",
    "rfid-live",
    "rfid-settings",
    "rfid-printers",
    "rfid-facility-map",

    "reports",
    "workorders",

    "settings",

    "users"
  ]
};

export const canUseModule = (
  plan: string | undefined,
  module: string
): boolean => {

  if (!plan) {
    return false;
  }

  const modules =
    PLAN_MODULES[plan] ?? [];

  return modules.includes(
    module
  );
};

export const canUseAssets = (
  plan?: string
): boolean =>
  canUseModule(
    plan,
    "assets"
  );

export const canUseInventory = (
  plan?: string
): boolean =>
  canUseModule(
    plan,
    "inventory"
  );

export const canUseRfid = (
  plan?: string
): boolean =>
  canUseModule(
    plan,
    "rfid"
  );