import { api } from "../api/apiClient";

export const getLocations = async () => {
  const response = await api.get(
    "/v2/Locations?page=1&pageSize=50"
  );

  return response.data;
};

export const createLocation = async (
  location: any
) => {
  const response = await api.post(
    "/v2/Locations",
    location
  );

  return response.data;
};

export const updateLocation = async (
  id: string,
  location: any
) => {
  const response = await api.patch(
    `/v2/Locations/${id}`,
    location
  );

  return response.data;
};

export const deleteLocation = async (
  id: string
) => {
  const response = await api.delete(
    `/v2/Locations/${id}`
  );

  return response.data;
};
