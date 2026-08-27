import type {
  ProductionEvent,
} from "../models/ProductionEvent";

export const mockProductionEvents:
ProductionEvent[] = [

  {
    epc: "PAPO-TEST-0001",
    zone: "Platinas",
    timestamp:
      "2026-08-27T08:00:00",
  },

  {
    epc: "PAPO-TEST-0001",
    zone: "Alambrado",
    timestamp:
      "2026-08-27T10:00:00",
  },

  {
    epc: "PAPO-TEST-0001",
    zone: "WP Alambrado",
    timestamp:
      "2026-08-27T13:30:00",
  },

];