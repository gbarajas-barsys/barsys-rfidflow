# Barsys RFIDFlow Backend Base (.NET)

Backend base empresarial para **Barsys RFIDFlow API v2.0**, alineado con el contrato `openapi.yaml` generado previamente.

## Stack propuesto

- ASP.NET Core sobre .NET 10 LTS.
- Arquitectura limpia: `Api`, `Application`, `Domain`, `Infrastructure`.
- Swagger/OpenAPI en `/swagger`.
- Multi-tenant mediante header `X-Tenant-Id`.
- Repositorios en memoria para acelerar el prototipo.
- Preparado para reemplazar persistencia por PostgreSQL con EF Core/Npgsql.
- Dockerfile y docker-compose con PostgreSQL.

## Ejecutar localmente

```bash
dotnet restore Barsys.RfidFlow.sln
dotnet run --project src/Barsys.RfidFlow.Api
```

Luego abrir:

```text
https://localhost:5001/swagger
```

o con Docker:

```bash
docker compose up --build
```

## Endpoints incluidos en esta base

- `/v2/auth/login`, `/v2/auth/refresh`, `/v2/auth/logout`, `/v2/auth/me`
- `/v2/tenants`
- `/v2/organizations`
- `/v2/users`
- `/v2/locations`
- `/v2/assets`
- `/v2/items`
- `/v2/rfid/tags`
- `/v2/rfid/readers`
- `/v2/rfid/read-events`
- `/v2/rfid/read-events/batch`
- `/v2/reports/inventory-summary`
- `/v2/reports/rfid-read-quality`
- `/v2/system/health`
- `/v2/system/version`

## Próximas iteraciones recomendadas

1. Sustituir `InMemoryRepository` por `RfidFlowDbContext` con PostgreSQL.
2. Generar migraciones EF Core desde el DDL PostgreSQL oficial.
3. Implementar handlers CQRS por módulo.
4. Añadir FluentValidation.
5. Activar JWT real con Azure AD B2C / Entra External ID.
6. Añadir pruebas de integración con `WebApplicationFactory`.
7. Generar clientes TypeScript con NSwag/OpenAPI Generator.


## Persistencia PostgreSQL / EF Core

Esta versión agrega persistencia real con PostgreSQL mediante EF Core y el proveedor Npgsql.

Archivos clave:

```text
database/schema.sql
src/Barsys.RfidFlow.Infrastructure/Persistence/RfidFlowDbContext.cs
src/Barsys.RfidFlow.Infrastructure/Repositories/EfRepository.cs
src/Barsys.RfidFlow.Infrastructure/Migrations/20260729180000_InitialCreate.cs
docs/postgresql-ddl-v2.sql
```

Aplicar DDL directo:

```bash
docker compose up -d postgres
psql "Host=localhost;Port=5432;Database=rfidflow;Username=rfidflow;Password=rfidflow" -f database/schema.sql
```

Aplicar con EF Core:

```bash
dotnet tool install --global dotnet-ef
dotnet ef database update   --project src/Barsys.RfidFlow.Infrastructure   --startup-project src/Barsys.RfidFlow.Api   --context RfidFlowDbContext
```

Para volver temporalmente al repositorio en memoria, agrega en `appsettings.Development.json`:

```json
{
  "UseInMemoryRepository": true
}
```


## CQRS + FluentValidation + Services por módulo

Esta iteración agrega una capa de aplicación basada en CQRS con MediatR y validación centralizada con FluentValidation.

Archivos clave:

```text
src/Barsys.RfidFlow.Application/Behaviors/ValidationBehavior.cs
src/Barsys.RfidFlow.Application/Common/TenantContext.cs
src/Barsys.RfidFlow.Application/Common/OperationResult.cs
src/Barsys.RfidFlow.Application/Features/Assets/Commands/CreateAssetCommand.cs
src/Barsys.RfidFlow.Application/Features/Assets/Commands/AssignTagToAssetCommand.cs
src/Barsys.RfidFlow.Application/Features/Assets/Queries/GetAssetTimelineQuery.cs
src/Barsys.RfidFlow.Application/Features/Rfid/Commands/IngestRfidReadEventCommand.cs
src/Barsys.RfidFlow.Application/Features/Rfid/Commands/IngestRfidReadEventBatchCommand.cs
src/Barsys.RfidFlow.Application/Features/Inventory/Commands/CreateInventoryMovementCommand.cs
src/Barsys.RfidFlow.Application/Features/Inventory/Commands/CompleteInventoryCountCommand.cs
src/Barsys.RfidFlow.Application/Features/WorkOrders/Commands/CreateWorkOrderCommand.cs
src/Barsys.RfidFlow.Api/Infrastructure/ValidationExceptionMiddleware.cs
```

Casos de uso incluidos:

- Crear activo.
- Asignar tag RFID a activo.
- Consultar timeline de activo.
- Ingestar evento RFID.
- Ingestar lote RFID.
- Crear movimiento de inventario.
- Completar conteo de inventario, placeholder operativo.
- Crear work order.

El pipeline `ValidationBehavior<TRequest,TResponse>` ejecuta todos los validators antes del handler, por lo que los handlers quedan concentrados en lógica de negocio.


## Pruebas automatizadas xUnit

Esta iteración agrega pruebas unitarias y de integración para la capa CQRS y endpoints críticos.

Ejecutar:

```bash
dotnet test Barsys.RfidFlow.sln
```

El proyecto de pruebas usa `CustomWebApplicationFactory` para ejecutar la API en ambiente `Testing` y activar `UseInMemoryRepository=true`, evitando dependencia de PostgreSQL durante pruebas rápidas.

Más detalle en:

```text
docs/test-strategy-xunit-v2.md
```


## Observabilidad y operación empresarial

Esta iteración agrega una base operativa empresarial:

- Serilog para logs estructurados JSON.
- Correlation ID con `X-Correlation-Id`.
- Auditoría HTTP básica para operaciones mutables y errores.
- OpenTelemetry para traces y metrics.
- Health checks `/health/live` y `/health/ready`.
- Endpoint Prometheus `/metrics`.
- Métricas de negocio para RFID, activos e inventario.
- Docker Compose con Seq y OpenTelemetry Collector.

Ejecutar:

```bash
docker compose up --build
```

Abrir:

```text
Swagger: http://localhost:8080/swagger
Metrics: http://localhost:8080/metrics
Seq: http://localhost:5341
```

Guía completa:

```text
docs/observability-operability-v2.md
```
