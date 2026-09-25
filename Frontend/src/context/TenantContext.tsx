import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

export interface Tenant {
  id: string;
  name: string;
  code?: string;
  plan?: string;
  country?: string;
  timezone?: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  setTenant: (
    tenant: Tenant
  ) => void;
}

const TenantContext =
  createContext<
    TenantContextType | undefined
  >(undefined);

export function TenantProvider({
  children
}: {
  children: React.ReactNode;
}) {

  const [tenant, setTenantState] =
    useState<Tenant | null>(null);

  useEffect(() => {

    const id = localStorage.getItem(
    "selectedTenantId"
    );

    const name = localStorage.getItem(
    "selectedTenantName"
    );

    const code = localStorage.getItem(
    "selectedTenantCode"
    );

    const plan = localStorage.getItem(
    "selectedTenantPlan"
    );

    const country = localStorage.getItem(
    "selectedTenantCountry"
    );

    const timezone = localStorage.getItem(
    "selectedTenantTimezone"
    );

    if (
      id &&
      name
    ) {
      setTenantState({
        id,
        name,
        code,
        plan,
        country,
        timezone
        });
    }

  }, []);

  const setTenant = (
    tenant: Tenant
  ) => {

    setTenantState(
      tenant
    );

    localStorage.setItem(
      "selectedTenantId",
      tenant.id
    );

    localStorage.setItem(
      "selectedTenantName",
      tenant.name
    );

    localStorage.setItem(
    "selectedTenantCode",
    tenant.code ?? ""
    );

    localStorage.setItem(
    "selectedTenantPlan",
    tenant.plan ?? ""
    );

    localStorage.setItem(
    "selectedTenantCountry",
    tenant.country ?? ""
    );

    localStorage.setItem(
    "selectedTenantTimezone",
    tenant.timezone ?? ""
    );
  };

  return (
    <TenantContext.Provider
      value={{
        tenant,
        setTenant
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {

  const context =
    useContext(
      TenantContext
    );

  if (!context) {

    throw new Error(
      "useTenant must be used inside TenantProvider"
    );
  }

  return context;
}