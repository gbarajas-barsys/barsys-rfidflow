import { ImpinjR700Provider }
  from "./providers/ImpinjR700Provider";

import type {
  RFIDRead,
} from "../models/RFIDRead";

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