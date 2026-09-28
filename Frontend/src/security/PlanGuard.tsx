import { Navigate } from "react-router-dom";

import { useTenant } from "../context/TenantContext";

import {
  canUseAssets,
  canUseInventory,
  canUseRfid
} from "./planAccessService";

type Props = {
  module: "assets" | "inventory" | "rfid";
  children: React.ReactNode;
};

export default function PlanGuard({
  module,
  children
}: Props) {

  const { tenant } = useTenant();

  let allowed = false;

  switch (module) {
    case "assets":
      allowed =
        canUseAssets(
          tenant?.plan
        );
      break;

    case "inventory":
      allowed =
        canUseInventory(
          tenant?.plan
        );
      break;

    case "rfid":
      allowed =
        canUseRfid(
          tenant?.plan
        );
      break;
  }

  if (!allowed) {
    return (
      <Navigate
        to="/403"
        replace
      />
    );
  }

  return <>{children}</>;
}