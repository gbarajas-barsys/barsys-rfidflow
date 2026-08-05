import { ImpinjR700Provider }
  from "./providers/ImpinjR700Provider";

export type RFIDRead = {
  epc: string;
  timestamp: string;
};

const readerUrl =
  localStorage.getItem(
    "rfid-reader-url"
  ) ??
  "http://localhost:5120";

export const rfidService =
  new ImpinjR700Provider(
    readerUrl
  );