namespace Barsys.RfidFlow.Domain.Enums;

public enum TenantStatus { Trial, Active, Suspended, Cancelled }
public enum UserStatus { Invited, Active, Locked, Disabled }
public enum LocationType { Site, Warehouse, Zone, Aisle, Rack, Bin, Dock, Vehicle, Mobile }
public enum AssetStatus { Available, InUse, InTransit, Maintenance, Lost, Retired }
public enum AssetCriticality { Low, Medium, High, Critical }
public enum RfidVendor { Zebra, Impinj, Honeywell, Chainway, Urovo, Other }
public enum DeviceStatus { Online, Offline, Warning, Error, Maintenance, Disabled }
public enum RfidTagStatus { Available, Assigned, Blocked, Damaged, Retired }
public enum InventoryMovementType { Receipt, Putaway, Transfer, Adjustment, Issue, Return, Shipment, CycleCountAdjustment }
public enum WorkOrderStatus { Draft, Open, Assigned, InProgress, Blocked, Completed, Cancelled }
