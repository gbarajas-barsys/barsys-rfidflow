import { api } from "../api/apiClient";

export const getTenants = async () => {
  const response = await api.get("/v2/Tenants");
  return response.data;
};