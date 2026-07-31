# Migrations

Este proyecto incluye el DDL empresarial en `database/schema.sql` y `docs/postgresql-ddl-v2.sql`.

Para generar una migración real en tu ambiente con SDK instalado:

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate   --project src/Barsys.RfidFlow.Infrastructure   --startup-project src/Barsys.RfidFlow.Api   --context RfidFlowDbContext

dotnet ef database update   --project src/Barsys.RfidFlow.Infrastructure   --startup-project src/Barsys.RfidFlow.Api   --context RfidFlowDbContext
```

También puedes aplicar directamente:

```bash
psql "Host=localhost;Port=5432;Database=rfidflow;Username=rfidflow;Password=rfidflow" -f database/schema.sql
```
