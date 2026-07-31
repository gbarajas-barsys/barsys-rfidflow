# Barsys RFIDFlow - Estrategia de Pruebas Automatizadas v2

## Objetivo

Asegurar que el backend evolucione con una base de calidad desde las primeras iteraciones, cubriendo:

- Validadores FluentValidation.
- Handlers CQRS.
- Integración HTTP con WebApplicationFactory.
- Health checks.
- Ingesta RFID.
- Operaciones críticas de activos e inventario.

## Capas cubiertas

```text
Unit Tests
  - Validators
  - Handlers

Integration Tests
  - Auth endpoints
  - Assets endpoints
  - RFID ingestion endpoints
  - Health/version endpoints
```

## Pruebas incluidas

### Validators

- `CreateAssetCommandValidatorTests`
- `AssignTagToAssetCommandValidatorTests`
- `IngestRfidReadEventCommandValidatorTests`
- `CreateInventoryMovementCommandValidatorTests`
- `CreateWorkOrderCommandValidatorTests`

### Handlers

- `CreateAssetCommandHandlerTests`
- `AssignTagToAssetCommandHandlerTests`
- `IngestRfidReadEventCommandHandlerTests`

### Integration

- `HealthTests`
- `AuthEndpointTests`
- `AssetEndpointTests`
- `RfidEndpointTests`

## Ejecutar pruebas

```bash
dotnet test Barsys.RfidFlow.sln
```

## Consideraciones

El `CustomWebApplicationFactory` fuerza `UseInMemoryRepository=true` para evitar dependencia de PostgreSQL en pruebas rápidas de integración.

Para pruebas de integración con PostgreSQL real, se recomienda una siguiente iteración con Testcontainers o docker-compose dedicado.
