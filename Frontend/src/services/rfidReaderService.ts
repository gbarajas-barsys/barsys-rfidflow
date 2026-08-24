import { api }
  from "../api/apiClient";

export const getReaders =
  async () => {
    const response =
      await api.get(
        "/v2/rfid/readers"
      );

    return response.data;
  };