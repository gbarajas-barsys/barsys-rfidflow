import type {
  ProductionJob,
} from "../models/ProductionJob";

export const mockProductionJobs:
  ProductionJob[] = [
  {
    project: "AA3798919-40",
    customer: "PECO ENERGY",
    model: "R-MAG",
    variant: "NEMA 4",
    capacity: "38KV 2000A 40kA",
    material: "1VAS000436-0001",
    startDate: "2025-08-27",
    epc: "PAPO-TEST-0001",
  },

  {
    project: "AA3727064-20",
    customer: "DELTA STAR",
    model: "R-MAG",
    variant: "NEMA 4",
    capacity: "27KV 1200A 25kA",
    material: "1VAS000436-0001",
    startDate: "2025-08-20",
    epc: "E280117000000002",
  },
];