import type {
  RFIDRead,
} from "../models/RFIDRead";

export const mockReads: RFIDRead[] = [
  {
    epc: "PAPO-TEST-0001",
    antennaId: 2,
    antennaName: "Rack A",
    zone: "Alambrado",
    timestamp: "2026-08-27T16:00:00",
    movement: "IN",
    },

  {
    epc: "E280117000000002",
    antennaId: 1,
    antennaName: "Receiving Gate",
    zone: "Embarques",
    timestamp: "2026-08-27T14:34:58",
    movement: "OUT",
  },

  {
    epc: "E280117000000003",
    antennaId: 2,
    antennaName: "Rack A",
    zone: "Alambrado",
    timestamp: "2026-08-27T14:34:41",
    movement: "IN",
  },
];