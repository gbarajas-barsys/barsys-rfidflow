import { ImpinjR700Provider }
  from "./providers/ImpinjR700Provider";

export type RFIDRead = {
  epc: string;
  timestamp: string;
};

export const rfidService =
  new ImpinjR700Provider(
    "http://localhost:5120"
  );
