import { api } from "../api/apiClient";

export async function getReentrySummary() {

  const response =
    await api.get(
      "/v2/dashboard/reentry-summary"
    );

  return response.data;
}