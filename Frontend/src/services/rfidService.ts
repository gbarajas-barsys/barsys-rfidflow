import { ImpinjR700Provider }
  from "./providers/ImpinjR700Provider";

import type {
  RFIDRead,
} from "../models/RFIDRead";

import { api }
  from "../api/apiClient";

const readerUrl =
  localStorage.getItem(
    "rfid-reader-url"
  ) ??
  "http://localhost:5120";

export const rfidService =
  new ImpinjR700Provider(
    readerUrl
  );

export const getMockReads =
  async (): Promise<
    RFIDRead[]
  > => {

    const {
      mockReads,
    } = await import(
      "../data/mockReads"
    );

    return mockReads;
  };

export const getReadEvents =
  async () => {

    const response =
      await api.get(
        "/v2/rfid/read-events"
      );

    return response.data;
  };