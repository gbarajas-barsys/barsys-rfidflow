-- Barsys RFIDFlow PostgreSQL DDL v2.0
-- Base empresarial multi-tenant para inventario, activos, RFID, trazabilidad y operación.

CREATE SCHEMA IF NOT EXISTS rfidflow;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS rfidflow.tenants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    name varchar(200) NOT NULL,
    code varchar(80) NOT NULL UNIQUE,
    legal_name varchar(250),
    country char(2) NOT NULL DEFAULT 'MX',
    timezone varchar(100) NOT NULL DEFAULT 'America/Mexico_City',
    status varchar(30) NOT NULL DEFAULT 'Trial',
    plan varchar(80) NOT NULL DEFAULT 'enterprise',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS rfidflow.organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    name varchar(200) NOT NULL,
    code varchar(80) NOT NULL,
    tax_id varchar(50),
    parent_organization_id uuid,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1,
    CONSTRAINT uq_organizations_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS rfidflow.users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    email varchar(320) NOT NULL,
    display_name varchar(200) NOT NULL,
    phone varchar(50),
    status varchar(30) NOT NULL DEFAULT 'Active',
    last_login_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1,
    CONSTRAINT uq_users_tenant_email UNIQUE (tenant_id, email)
);

CREATE TABLE IF NOT EXISTS rfidflow.roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    name varchar(120) NOT NULL,
    code varchar(80) NOT NULL,
    description text,
    permissions text[] NOT NULL DEFAULT ARRAY[]::text[],
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1,
    CONSTRAINT uq_roles_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS rfidflow.locations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    organization_id uuid NOT NULL REFERENCES rfidflow.organizations(id),
    parent_location_id uuid REFERENCES rfidflow.locations(id),
    code varchar(80) NOT NULL,
    name varchar(200) NOT NULL,
    type varchar(30) NOT NULL,
    latitude double precision,
    longitude double precision,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1,
    CONSTRAINT uq_locations_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE IF NOT EXISTS rfidflow.assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    asset_number varchar(100) NOT NULL,
    name varchar(200) NOT NULL,
    description text,
    category_id uuid,
    location_id uuid REFERENCES rfidflow.locations(id),
    assigned_to_user_id uuid REFERENCES rfidflow.users(id),
    epc varchar(128),
    serial_number varchar(120),
    status varchar(40) NOT NULL DEFAULT 'Available',
    criticality varchar(30) NOT NULL DEFAULT 'Medium',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1,
    CONSTRAINT uq_assets_tenant_number UNIQUE (tenant_id, asset_number)
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_assets_tenant_epc ON rfidflow.assets(tenant_id, epc) WHERE epc IS NOT NULL;

CREATE TABLE IF NOT EXISTS rfidflow.items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    sku varchar(100) NOT NULL,
    name varchar(200) NOT NULL,
    description text,
    category_id uuid,
    unit_of_measure varchar(20) NOT NULL DEFAULT 'PCS',
    barcode varchar(120),
    min_stock numeric(18,4),
    max_stock numeric(18,4),
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1,
    CONSTRAINT uq_items_tenant_sku UNIQUE (tenant_id, sku)
);

CREATE TABLE IF NOT EXISTS rfidflow.inventory_balances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    item_id uuid NOT NULL REFERENCES rfidflow.items(id),
    location_id uuid NOT NULL REFERENCES rfidflow.locations(id),
    lot_number varchar(120),
    serial_number varchar(120),
    quantity_on_hand numeric(18,4) NOT NULL DEFAULT 0,
    quantity_reserved numeric(18,4) NOT NULL DEFAULT 0,
    quantity_available numeric(18,4) NOT NULL DEFAULT 0,
    last_movement_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1
);
CREATE UNIQUE INDEX IF NOT EXISTS uq_inventory_balance_key ON rfidflow.inventory_balances(tenant_id, item_id, location_id, coalesce(lot_number,''), coalesce(serial_number,''));

CREATE TABLE IF NOT EXISTS rfidflow.inventory_movements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    movement_type varchar(50) NOT NULL,
    item_id uuid NOT NULL REFERENCES rfidflow.items(id),
    from_location_id uuid REFERENCES rfidflow.locations(id),
    to_location_id uuid REFERENCES rfidflow.locations(id),
    quantity numeric(18,4) NOT NULL,
    lot_number varchar(120),
    reference_type varchar(80),
    reference_id uuid,
    occurred_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS rfidflow.rfid_tags (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    epc varchar(128) NOT NULL,
    tid varchar(128),
    user_memory varchar(512),
    status varchar(30) NOT NULL DEFAULT 'Available',
    assigned_entity_type varchar(60),
    assigned_entity_id uuid,
    last_seen_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1,
    CONSTRAINT uq_rfid_tags_tenant_epc UNIQUE (tenant_id, epc)
);

CREATE TABLE IF NOT EXISTS rfidflow.rfid_readers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    name varchar(160) NOT NULL,
    serial_number varchar(120) NOT NULL,
    vendor varchar(40) NOT NULL,
    model varchar(120) NOT NULL,
    location_id uuid REFERENCES rfidflow.locations(id),
    status varchar(40) NOT NULL DEFAULT 'Offline',
    last_heartbeat_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1,
    CONSTRAINT uq_rfid_readers_tenant_serial UNIQUE (tenant_id, serial_number)
);

CREATE TABLE IF NOT EXISTS rfidflow.rfid_read_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    epc varchar(128) NOT NULL,
    reader_id uuid NOT NULL REFERENCES rfidflow.rfid_readers(id),
    antenna_id uuid,
    location_id uuid REFERENCES rfidflow.locations(id),
    rssi numeric(10,2),
    read_count integer NOT NULL DEFAULT 1,
    first_seen_at timestamptz NOT NULL,
    last_seen_at timestamptz NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS rfidflow.work_orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    work_order_number varchar(100) NOT NULL,
    type varchar(60) NOT NULL,
    title varchar(200) NOT NULL,
    description text,
    status varchar(40) NOT NULL DEFAULT 'Draft',
    priority varchar(30) NOT NULL DEFAULT 'medium',
    assigned_to_user_id uuid REFERENCES rfidflow.users(id),
    due_at timestamptz,
    metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1,
    CONSTRAINT uq_work_orders_tenant_number UNIQUE (tenant_id, work_order_number)
);

CREATE TABLE IF NOT EXISTS rfidflow.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL,
    user_id uuid,
    action varchar(120) NOT NULL,
    entity_type varchar(120) NOT NULL,
    entity_id uuid,
    ip_address varchar(80),
    user_agent text,
    before_json jsonb,
    after_json jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rfidflow.webhook_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    name varchar(160) NOT NULL,
    url varchar(1000) NOT NULL,
    events text[] NOT NULL DEFAULT ARRAY[]::text[],
    secret_hash text,
    status varchar(40) NOT NULL DEFAULT 'active',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS rfidflow.notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id uuid NOT NULL REFERENCES rfidflow.tenants(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES rfidflow.users(id),
    title varchar(200) NOT NULL,
    message text NOT NULL,
    severity varchar(40) NOT NULL DEFAULT 'info',
    read_at timestamptz,
    metadata_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    row_version bigint NOT NULL DEFAULT 1
);

-- Índices operativos
CREATE INDEX IF NOT EXISTS ix_organizations_tenant ON rfidflow.organizations(tenant_id);
CREATE INDEX IF NOT EXISTS ix_locations_tenant_org ON rfidflow.locations(tenant_id, organization_id);
CREATE INDEX IF NOT EXISTS ix_assets_tenant_status ON rfidflow.assets(tenant_id, status);
CREATE INDEX IF NOT EXISTS ix_assets_tenant_location ON rfidflow.assets(tenant_id, location_id);
CREATE INDEX IF NOT EXISTS ix_inventory_movements_tenant_occurred ON rfidflow.inventory_movements(tenant_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS ix_rfid_events_tenant_epc_lastseen ON rfidflow.rfid_read_events(tenant_id, epc, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS ix_rfid_events_tenant_reader_lastseen ON rfidflow.rfid_read_events(tenant_id, reader_id, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS ix_audit_logs_tenant_created ON rfidflow.audit_logs(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS ix_notifications_tenant_user_read ON rfidflow.notifications(tenant_id, user_id, read_at);

-- Seed mínimo para desarrollo
INSERT INTO rfidflow.tenants (id, tenant_id, name, code, status, plan)
VALUES ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Barsys Demo Tenant', 'barsys-demo', 'Active', 'enterprise')
ON CONFLICT (code) DO NOTHING;
