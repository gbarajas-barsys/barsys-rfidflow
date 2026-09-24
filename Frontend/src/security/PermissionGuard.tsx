import { Navigate } from "react-router-dom";

import {
  hasPermission,
} from "./permissionService";

type Props = {
  permission: string;

  children: React.ReactNode;
};

export default function PermissionGuard({
  permission,
  children,
}: Props) {
  const currentUser = JSON.parse(
    localStorage.getItem("currentUser") ?? "{}"
  );

  const permissions =
    currentUser.permissions ?? [];

  if (
    !hasPermission(
      permissions,
      permission
    )
  ) {
    return (
      <Navigate
        to="/403"
        replace
      />
    );
  }

  return <>{children}</>;
}