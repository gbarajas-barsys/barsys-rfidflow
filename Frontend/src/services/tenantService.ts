import { api } from "../api/apiClient";

export const getTenants = async () => {
  const response = await api.get("/v2/Tenants");
  return response.data;
};

export const createTenant = async (
  tenant: any
) => {
  const response = await api.post(
    "/v2/Tenants",
    tenant
  );

  return response.data;
};

export const updateTenant = async (
  id: string,
  tenant: any
) => {
  const response = await api.patch(
    `/v2/Tenants/${id}`,
    tenant
  );

  return response.data;
};

export const deleteTenant = async (
  id: string
) => {
  const response = await api.delete(
    `/v2/Tenants/${id}`
  );

  return response.data;
};