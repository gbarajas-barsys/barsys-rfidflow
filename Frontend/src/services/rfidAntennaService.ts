import { api }
  from "../api/apiClient";

export const getAntennas =
  async () => {

    const response =
      await api.get(
        "/v2/rfid/antennas"
      );

    return response.data;
  };

export const createAntenna =
  async (antenna: any) => {

    const response =
      await api.post(
        "/v2/rfid/antennas",
        antenna
      );

    return response.data;
  };

export const updateAntenna =
  async (
    id: string,
    antenna: any
  ) => {

    const response =
      await api.patch(
        `/v2/rfid/antennas/${id}`,
        antenna
      );

    return response.data;
  };

export const deleteAntenna =
  async (id: string) => {

    await api.delete(
      `/v2/rfid/antennas/${id}`
    );
  };