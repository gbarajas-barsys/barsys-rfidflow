using Barsys.RfidFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Barsys.RfidFlow.Infrastructure.Persistence;

public sealed class RfidFlowDbContext : DbContext
{
    public RfidFlowDbContext(DbContextOptions<RfidFlowDbContext> options) : base(options) { }

    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Organization> Organizations => Set<Organization>();
    public DbSet<UserAccount> Users => Set<UserAccount>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Location> Locations => Set<Location>();
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<Item> Items => Set<Item>();
    public DbSet<InventoryBalance> InventoryBalances => Set<InventoryBalance>();
    public DbSet<InventoryMovement> InventoryMovements => Set<InventoryMovement>();
    public DbSet<RfidTag> RfidTags => Set<RfidTag>();
    public DbSet<RfidReader> RfidReaders => Set<RfidReader>();
    public DbSet<RfidReadEvent> RfidReadEvents => Set<RfidReadEvent>();
    public DbSet<WorkOrder> WorkOrders => Set<WorkOrder>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<WebhookSubscription> WebhookSubscriptions => Set<WebhookSubscription>();
    public DbSet<Notification> Notifications => Set<Notification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("rfidflow");
        ConfigureBaseEntities(modelBuilder);

        modelBuilder.Entity<Tenant>(b =>
{
    b.ToTable("tenants");

    b.HasIndex(x => x.Code).IsUnique();

    b.Property(x => x.Name)
        .HasColumnName("name")
        .HasMaxLength(200)
        .IsRequired();

    b.Property(x => x.Code)
        .HasColumnName("code")
        .HasMaxLength(80)
        .IsRequired();

    b.Property(x => x.LegalName)
        .HasColumnName("legal_name")
        .HasMaxLength(250);

    b.Property(x => x.Country)
        .HasColumnName("country")
        .HasMaxLength(2);

    b.Property(x => x.Timezone)
        .HasColumnName("timezone")
        .HasMaxLength(100);

    b.Property(x => x.Status)
        .HasColumnName("status")
        .HasConversion<string>()
        .HasMaxLength(30);

    b.Property(x => x.Plan)
        .HasColumnName("plan")
        .HasMaxLength(80);
});

        modelBuilder.Entity<Organization>(b =>
        {
            b.ToTable("organizations");
            b.HasIndex(x => new { x.TenantId, x.Code }).IsUnique();
            b.Property(x => x.Name).HasMaxLength(200).IsRequired();
            b.Property(x => x.Code).HasMaxLength(80).IsRequired();
            b.Property(x => x.TaxId).HasMaxLength(50);
        });

        modelBuilder.Entity<UserAccount>(b =>
        {
            b.ToTable("users");
            b.HasIndex(x => new { x.TenantId, x.Email }).IsUnique();
            b.Property(x => x.Email).HasMaxLength(320).IsRequired();
            b.Property(x => x.DisplayName).HasMaxLength(200).IsRequired();
            b.Property(x => x.Phone).HasMaxLength(50);
            b.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
            b.Property(x => x.DisplayName)
            .HasColumnName("display_name");

            b.Property(x => x.LastLoginAt)
            .HasColumnName("last_login_at");
        });

        modelBuilder.Entity<Role>(b =>
        {
            b.ToTable("roles");
            b.HasIndex(x => new { x.TenantId, x.Code }).IsUnique();
            b.Property(x => x.Name).HasMaxLength(120).IsRequired();
            b.Property(x => x.Code).HasMaxLength(80).IsRequired();
            b.Property(x => x.Permissions).HasColumnType("text[]");
        });

        modelBuilder.Entity<Location>(b =>
        {
            b.ToTable("locations");
            b.HasIndex(x => new { x.TenantId, x.Code }).IsUnique();
            b.HasIndex(x => x.OrganizationId);
            b.Property(x => x.Code).HasMaxLength(80).IsRequired();
            b.Property(x => x.Name).HasMaxLength(200).IsRequired();
            b.Property(x => x.Type).HasConversion<string>().HasMaxLength(30);
        });

        modelBuilder.Entity<Asset>(b =>
        {
            b.ToTable("assets");
            b.HasIndex(x => new { x.TenantId, x.AssetNumber }).IsUnique();
            b.HasIndex(x => new { x.TenantId, x.Epc }).IsUnique().HasFilter("epc IS NOT NULL");
            b.Property(x => x.AssetNumber).HasMaxLength(100).IsRequired();
            b.Property(x => x.Name).HasMaxLength(200).IsRequired();
            b.Property(x => x.Epc).HasMaxLength(128);
            b.Property(x => x.SerialNumber).HasMaxLength(120);
            b.Property(x => x.Status).HasConversion<string>().HasMaxLength(40);
            b.Property(x => x.Criticality).HasConversion<string>().HasMaxLength(30);
        });

        modelBuilder.Entity<Item>(b =>
        {
            b.ToTable("items");
            b.HasIndex(x => new { x.TenantId, x.Sku }).IsUnique();
            b.Property(x => x.Sku).HasMaxLength(100).IsRequired();
            b.Property(x => x.Name).HasMaxLength(200).IsRequired();
            b.Property(x => x.UnitOfMeasure).HasMaxLength(20);
            b.Property(x => x.MinStock).HasPrecision(18, 4);
            b.Property(x => x.MaxStock).HasPrecision(18, 4);
            b.ToTable("items");

            b.Property(x => x.Active)
            .HasColumnName("active");

            b.Property(x => x.UnitOfMeasure)
            .HasColumnName("unit_of_measure");

            b.Property(x => x.CategoryId)
            .HasColumnName("category_id");

        });

        modelBuilder.Entity<InventoryBalance>(b =>
        {
            b.ToTable("inventory_balances");
            b.HasIndex(x => new { x.TenantId, x.ItemId, x.LocationId, x.LotNumber, x.SerialNumber }).IsUnique();
            b.Property(x => x.QuantityOnHand).HasPrecision(18, 4);
            b.Property(x => x.QuantityReserved).HasPrecision(18, 4);
            b.Property(x => x.QuantityAvailable).HasPrecision(18, 4);
        });

        modelBuilder.Entity<InventoryMovement>(b =>
        {
            b.ToTable("inventory_movements");
            b.HasIndex(x => new { x.TenantId, x.OccurredAt });
            b.Property(x => x.MovementType).HasConversion<string>().HasMaxLength(50);
            b.Property(x => x.Quantity).HasPrecision(18, 4);
            b.Property(x => x.LotNumber).HasMaxLength(120);
        });

        modelBuilder.Entity<RfidTag>(b =>
        {
            b.ToTable("rfid_tags");
            b.HasIndex(x => new { x.TenantId, x.Epc }).IsUnique();
            b.Property(x => x.Epc).HasMaxLength(128).IsRequired();
            b.Property(x => x.Tid).HasMaxLength(128);
            b.Property(x => x.UserMemory).HasMaxLength(512);
            b.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
        });

        modelBuilder.Entity<RfidReader>(b =>
{
    b.Property(x => x.IpAddress)
        .HasColumnName("ip_address")
        .HasMaxLength(100);

    b.Property(x => x.Port)
        .HasColumnName("port");

    b.Property(x => x.Enabled)
        .HasColumnName("enabled");
        
    b.ToTable("rfid_readers");

    b.HasIndex(x => new { x.TenantId, x.SerialNumber })
        .IsUnique();

    b.Property(x => x.Name)
        .HasColumnName("name")
        .HasMaxLength(160)
        .IsRequired();

    b.Property(x => x.SerialNumber)
        .HasColumnName("serial_number")
        .HasMaxLength(120)
        .IsRequired();

    b.Property(x => x.Vendor)
        .HasColumnName("vendor")
        .HasConversion<string>()
        .HasMaxLength(40);

    b.Property(x => x.Model)
        .HasColumnName("model")
        .HasMaxLength(120)
        .IsRequired();

    b.Property(x => x.LocationId)
        .HasColumnName("location_id");

    b.Property(x => x.Status)
        .HasColumnName("status")
        .HasConversion<string>()
        .HasMaxLength(40);

    b.Property(x => x.LastHeartbeatAt)
        .HasColumnName("last_heartbeat_at");
});

        modelBuilder.Entity<RfidReadEvent>(b =>
{
    b.ToTable("rfid_read_events");

    b.HasIndex(x => new { x.TenantId, x.Epc, x.LastSeenAt });
    b.HasIndex(x => new { x.TenantId, x.ReaderId, x.LastSeenAt });

    b.Property(x => x.Epc)
        .HasColumnName("epc")
        .HasMaxLength(128)
        .IsRequired();

    b.Property(x => x.ReaderId)
        .HasColumnName("reader_id");

    b.Property(x => x.AntennaId)
        .HasColumnName("antenna_id");

    b.Property(x => x.LocationId)
        .HasColumnName("location_id");

    b.Property(x => x.Rssi)
        .HasColumnName("rssi")
        .HasPrecision(10, 2);

    b.Property(x => x.ReadCount)
        .HasColumnName("read_count");

    b.Property(x => x.FirstSeenAt)
        .HasColumnName("first_seen_at");

    b.Property(x => x.LastSeenAt)
        .HasColumnName("last_seen_at");
});

        modelBuilder.Entity<WorkOrder>(b =>
        {
            b.ToTable("work_orders");
            b.HasIndex(x => new { x.TenantId, x.WorkOrderNumber }).IsUnique();
            b.Property(x => x.WorkOrderNumber).HasMaxLength(100).IsRequired();
            b.Property(x => x.Type).HasMaxLength(60).IsRequired();
            b.Property(x => x.Title).HasMaxLength(200).IsRequired();
            b.Property(x => x.Status).HasConversion<string>().HasMaxLength(40);
            b.Property(x => x.MetadataJson).HasColumnType("jsonb");
        });

        modelBuilder.Entity<AuditLog>(b =>
        {
            b.ToTable("audit_logs");
            b.HasKey(x => x.Id);
            b.HasIndex(x => new { x.TenantId, x.CreatedAt });
            b.Property(x => x.Action).HasMaxLength(120).IsRequired();
            b.Property(x => x.EntityType).HasMaxLength(120).IsRequired();
            b.Property(x => x.BeforeJson).HasColumnType("jsonb");
            b.Property(x => x.AfterJson).HasColumnType("jsonb");
        });

        modelBuilder.Entity<WebhookSubscription>(b =>
        {
            b.ToTable("webhook_subscriptions");
            b.Property(x => x.Name).HasMaxLength(160).IsRequired();
            b.Property(x => x.Url).HasMaxLength(1000).IsRequired();
            b.Property(x => x.Events).HasColumnType("text[]");
            b.Property(x => x.Status).HasMaxLength(40);
        });

        modelBuilder.Entity<Notification>(b =>
        {
            b.ToTable("notifications");
            b.HasIndex(x => new { x.TenantId, x.UserId, x.ReadAt });
            b.Property(x => x.Title).HasMaxLength(200).IsRequired();
            b.Property(x => x.Severity).HasMaxLength(40);
            b.Property(x => x.MetadataJson).HasColumnType("jsonb");
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        StampEntities(ChangeTracker.Entries<BaseEntity>());
        return base.SaveChangesAsync(cancellationToken);
    }

    private static void StampEntities(IEnumerable<EntityEntry<BaseEntity>> entries)
    {
        var now = DateTimeOffset.UtcNow;
        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
                entry.Entity.RowVersion = 1;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
                entry.Entity.RowVersion++;
            }
        }
    }

    private static void ConfigureBaseEntities(ModelBuilder modelBuilder)
    {
        foreach (var entityType in modelBuilder.Model.GetEntityTypes()
            .Where(t => typeof(BaseEntity).IsAssignableFrom(t.ClrType)))
        {
            var b = modelBuilder.Entity(entityType.ClrType);

            b.HasKey(nameof(BaseEntity.Id));

            b.Property<Guid>(nameof(BaseEntity.Id))
            .HasColumnName("id");

            b.Property<Guid>(nameof(BaseEntity.TenantId))
            .HasColumnName("tenant_id")
            .IsRequired();

            b.Property<DateTimeOffset>(nameof(BaseEntity.CreatedAt))
            .HasColumnName("created_at")
            .IsRequired();

            b.Property<DateTimeOffset>(nameof(BaseEntity.UpdatedAt))
            .HasColumnName("updated_at")
            .IsRequired();

            b.Property<Guid?>(nameof(BaseEntity.CreatedBy))
            .HasColumnName("created_by");

            b.Property<Guid?>(nameof(BaseEntity.UpdatedBy))
            .HasColumnName("updated_by");

            b.Property<long>(nameof(BaseEntity.RowVersion))
            .HasColumnName("row_version")
            .IsConcurrencyToken();

            b.HasIndex(nameof(BaseEntity.TenantId));
        }
    }
}
