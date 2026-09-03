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

export const getReaderStatus =
  async () => {

    const response =
      await fetch(
        "http://localhost:5120/api/readers/status"
      );

    return response.json();
  };

export const createReader =
  async (reader: any) => {

    const response =
      await api.post(
        "/v2/rfid/readers",
        reader
      );

    return response.data;
  };