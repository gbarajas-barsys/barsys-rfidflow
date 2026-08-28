import type {
  Reader,
} from "../models/Reader";

export const mockReaders:
  Reader[] = [

  {
    id: 1,
    name: "Reader A",
    model: "Impinj R700",
    ipAddress:
      "192.168.1.100",
    status: "online",
  },

  {
    id: 2,
    name: "Reader B",
    model: "Impinj R700",
    ipAddress:
      "192.168.1.101",
    status: "offline",
  },

];