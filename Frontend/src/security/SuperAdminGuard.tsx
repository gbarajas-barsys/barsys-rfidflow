import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function SuperAdminGuard(
  { children }: Props
) {

  const currentUser = JSON.parse(
    localStorage.getItem(
      "currentUser"
    ) ?? "{}"
  );

  const isSuperAdmin =
    currentUser.roles?.includes(
      "SUPER_ADMIN"
    );

  return isSuperAdmin
    ? <>{children}</>
    : <Navigate to="/403" />;
}