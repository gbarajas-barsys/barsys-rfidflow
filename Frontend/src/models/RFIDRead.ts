export interface RFIDRead {
  epc: string;
  antennaId: number;
  antennaName: string;
  zone: string;
  timestamp: string;
  movement: "IN" | "OUT";
}