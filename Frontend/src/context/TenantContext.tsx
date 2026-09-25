import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

export interface Tenant {
  id: string;
  name: string;
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

    const id =
      localStorage.getItem(
        "selectedTenantId"
      );

    const name =
      localStorage.getItem(
        "selectedTenantName"
      );

    if (
      id &&
      name
    ) {
      setTenantState({
        id,
        name
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